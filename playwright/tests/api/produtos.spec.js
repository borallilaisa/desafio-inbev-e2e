const { test, expect } = require('@playwright/test');
const { criarProduto, criarUsuario, ID_INEXISTENTE } = require('../../support/factories/dataFactory');
const { API_URL } = require('../../support/config');

test.describe('API Produtos', () => {
  let admin;
  let produtosCriados;

  test.beforeEach(async ({ request }) => {
    produtosCriados = [];

    const dadosAdmin = criarUsuario({ administrador: 'true' });
    const respostaUsuario = await request.post(`${API_URL}/usuarios`, { data: dadosAdmin });
    const usuarioCriado = await respostaUsuario.json();

    const respostaLogin = await request.post(`${API_URL}/login`, {
      data: { email: dadosAdmin.email, password: dadosAdmin.password },
    });
    const login = await respostaLogin.json();

    admin = { ...dadosAdmin, _id: usuarioCriado._id, token: login.authorization };
  });

  const criarProdutoComoAdmin = async (request) => {
    const produto = criarProduto();
    const response = await request.post(`${API_URL}/produtos`, {
      data: produto,
      headers: { Authorization: admin.token },
    });
    const body = await response.json();
    produtosCriados.push(body._id);
    return { ...produto, _id: body._id };
  };

  test.afterEach(async ({ request }) => {
    // Limpeza: remove os produtos criados e depois o administrador.
    for (const id of produtosCriados) {
      await request.delete(`${API_URL}/produtos/${id}`, {
        headers: { Authorization: admin.token },
      });
    }
    await request.delete(`${API_URL}/usuarios/${admin._id}`);
  });

  test('cadastrar produto como administrador', async ({ request }) => {
    const produto = await criarProdutoComoAdmin(request);

    expect(produto._id).toBeTruthy();

    const consulta = await request.get(`${API_URL}/produtos/${produto._id}`);
    const body = await consulta.json();

    expect(consulta.status()).toBe(200);
    expect(body).toMatchObject({
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade,
    });
  });

  test('nao cadastrar produto sem token valido', async ({ request }) => {
    const response = await request.post(`${API_URL}/produtos`, { data: criarProduto() });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });

  test('não deve permitir cadastro por usuário não administrador (POST /produtos)', async ({ request }) => {
    // Massa: usuário comum autenticado.
    const dadosUsuario = criarUsuario({ administrador: 'false' });
    const respostaCriacao = await request.post(`${API_URL}/usuarios`, { data: dadosUsuario });
    const usuarioCriado = await respostaCriacao.json();
    const respostaLogin = await request.post(`${API_URL}/login`, {
      data: { email: dadosUsuario.email, password: dadosUsuario.password },
    });
    const login = await respostaLogin.json();

    // Ação: usuário comum tentando cadastrar produto.
    const response = await request.post(`${API_URL}/produtos`, {
      data: criarProduto(),
      headers: { Authorization: login.authorization },
    });
    const body = await response.json();

    expect(response.status()).toBe(403);
    expect(body.message).toBe('Rota exclusiva para administradores');

    await request.delete(`${API_URL}/usuarios/${usuarioCriado._id}`);
  });

  test('não deve cadastrar dois produtos com o mesmo nome (POST /produtos)', async ({ request }) => {
    // Massa: primeiro produto.
    const produto = await criarProdutoComoAdmin(request);

    // Ação: tenta cadastrar outro produto com o mesmo nome.
    const response = await request.post(`${API_URL}/produtos`, {
      data: criarProduto({ nome: produto.nome }),
      headers: { Authorization: admin.token },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe('Já existe produto com esse nome');
  });

  test('deve listar produtos e permitir filtrar por nome (GET /produtos)', async ({ request }) => {
    const produto = await criarProdutoComoAdmin(request);

    // Ação: filtra pelo nome único do produto.
    const response = await request.get(`${API_URL}/produtos`, {
      params: { nome: produto.nome },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.quantidade).toBe(1);
    expect(body.produtos[0]).toMatchObject({
      nome: produto.nome,
      _id: produto._id,
    });
  });

  test('deve retornar 400 ao buscar um produto inexistente (GET /produtos/{_id})', async ({ request }) => {
    // Ação: id de formato válido, mas que não existe.
    const response = await request.get(`${API_URL}/produtos/${ID_INEXISTENTE}`);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe('Produto não encontrado');
  });

  test('deve atualizar um produto existente (PUT /produtos/{_id})', async ({ request }) => {
    const produto = await criarProdutoComoAdmin(request);
    const dadosAtualizados = criarProduto({ nome: `${produto.nome}-editado` });

    // Ação.
    const response = await request.put(`${API_URL}/produtos/${produto._id}`, {
      data: dadosAtualizados,
      headers: { Authorization: admin.token },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Registro alterado com sucesso');

    // Confirma a persistência.
    const consulta = await request.get(`${API_URL}/produtos/${produto._id}`);
    const consultaBody = await consulta.json();
    expect(consultaBody).toMatchObject({
      nome: dadosAtualizados.nome,
      preco: dadosAtualizados.preco,
    });
  });

  test('deve excluir um produto existente (DELETE /produtos/{_id})', async ({ request }) => {
    // Massa: produto dedicado a este teste.
    const respostaCriacao = await request.post(`${API_URL}/produtos`, {
      data: criarProduto(),
      headers: { Authorization: admin.token },
    });
    const produto = await respostaCriacao.json();

    // Ação: remove o produto.
    const response = await request.delete(`${API_URL}/produtos/${produto._id}`, {
      headers: { Authorization: admin.token },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Registro excluído com sucesso');

    // Confirma que não existe mais.
    const consulta = await request.get(`${API_URL}/produtos/${produto._id}`);
    expect(consulta.status()).toBe(400);
  });

  test('deve informar "Nenhum registro excluído" ao remover produto inexistente', async ({ request }) => {
    // Ação: exclusão de um id de formato válido, mas que não existe.
    const response = await request.delete(`${API_URL}/produtos/${ID_INEXISTENTE}`, {
      headers: { Authorization: admin.token },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Nenhum registro excluído');
  });
});
