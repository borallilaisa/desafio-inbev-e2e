const { test, expect } = require('@playwright/test');
const { criarUsuario, ID_INEXISTENTE } = require('../../support/factories/dataFactory');
const { API_URL } = require('../../support/config');

test.describe('API Usuarios', () => {
  let usuario;

  test.beforeEach(async ({ request }) => {
    const dados = criarUsuario();
    const response = await request.post(`${API_URL}/usuarios`, { data: dados });
    const body = await response.json();
    usuario = { ...dados, _id: body._id };
  });

  test.afterEach(async ({ request }) => {
    if (usuario && usuario._id) {
      await request.delete(`${API_URL}/usuarios/${usuario._id}`);
    }
  });

  test('cadastrar usuario com sucesso', async ({ request }) => {
    const dados = criarUsuario({ administrador: 'true' });

    const response = await request.post(`${API_URL}/usuarios`, { data: dados });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();

    await request.delete(`${API_URL}/usuarios/${body._id}`);
  });

  test('nao cadastrar com email já utilizado', async ({ request }) => {
    const response = await request.post(`${API_URL}/usuarios`, {
      data: criarUsuario({ email: usuario.email }),
    });

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe('Este email já está sendo usado');
  });

  test('listar usuarios e filtrar por email', async ({ request }) => {
    const response = await request.get(`${API_URL}/usuarios`, {
      params: { email: usuario.email },
    });

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.quantidade).toBe(1);
    expect(body.usuarios[0]).toMatchObject({
      nome: usuario.nome,
      email: usuario.email,
      administrador: usuario.administrador,
    });
  });

  test('buscar usuario pelo id', async ({ request }) => {
    const response = await request.get(`${API_URL}/usuarios/${usuario._id}`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toMatchObject({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
    });
  });

  test('retornar 400 ao buscar um usuário inexistente', async ({ request }) => {
    const response = await request.get(`${API_URL}/usuarios/${ID_INEXISTENTE}`);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe('Usuário não encontrado');
  });

  test('atualizar um usuário existente', async ({ request }) => {
    const dadosAtualizados = criarUsuario({ email: usuario.email });

    const response = await request.put(`${API_URL}/usuarios/${usuario._id}`, {
      data: dadosAtualizados,
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Registro alterado com sucesso');

    const consulta = await request.get(`${API_URL}/usuarios/${usuario._id}`);
    const consultaBody = await consulta.json();
    expect(consultaBody.nome).toBe(dadosAtualizados.nome);
  });

  test('cadastrar novo usuário ao atualizar um id inexistente', async ({ request }) => {
    const response = await request.put(`${API_URL}/usuarios/id-inexistente-999`, {
      data: criarUsuario(),
    });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.message).toBe('Cadastro realizado com sucesso');

    await request.delete(`${API_URL}/usuarios/${body._id}`);
  });

  test('excluir um usuário com sucesso', async ({ request }) => {
    const response = await request.delete(`${API_URL}/usuarios/${usuario._id}`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Registro excluído com sucesso');

    // Confirma que não existe mais.
    const consulta = await request.get(`${API_URL}/usuarios/${usuario._id}`);
    expect(consulta.status()).toBe(400);
  });

  test('informar "Nenhum registro excluído" ao remover usuário inexistente', async ({ request }) => {
    // Ação: exclusão de um id de formato válido, mas que não existe.
    const response = await request.delete(`${API_URL}/usuarios/${ID_INEXISTENTE}`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Nenhum registro excluído');
  });
});
