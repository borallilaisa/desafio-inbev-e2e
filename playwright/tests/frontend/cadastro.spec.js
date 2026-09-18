const { test, expect } = require('@playwright/test');
const RegisterPage = require('../../pages/RegisterPage');
const { criarUsuario } = require('../../support/factories/dataFactory');
const { API_URL } = require('../../support/config');

test.describe('FrontEnd Cadastro de Usuario', () => {
  test('cadastrar novo usuario com sucesso', async ({page, request}) => {
    const usuario = criarUsuario();
    const cadastro = new RegisterPage(page);

    await cadastro.acessar();
    await cadastro.cadastrar(usuario);

    await expect(cadastro.alertaSucesso).toBeVisible();
    await expect(cadastro.alertaSucesso).toContainText('Cadastro realizado com sucesso');

    const lista = await request.get(`${API_URL}/usuarios`, {
      params: { email: usuario.email },
    });
    const listaBody = await lista.json();
    expect(lista.status()).toBe(200);
    expect(listaBody.quantidade).toBe(1);

    await request.delete(`${API_URL}/usuarios/${listaBody.usuarios[0]._id}`);
  });

  test('nao cadastrar usuario com e-mail ja existente', async ({ page, request}) => {
    const dados = criarUsuario();
    const respostaCriacao = await request.post(`${API_URL}/usuarios`, { data: dados });
    const existente = await respostaCriacao.json();
    const cadastro = new RegisterPage(page);

    await cadastro.acessar();
    await cadastro.cadastrar(criarUsuario({ email: dados.email, password: 'senha12345' }));

    await expect(cadastro.alertaErro).toBeVisible();
    await expect(cadastro.alertaErro).toContainText('Este email já está sendo usado');

    await request.delete(`${API_URL}/usuarios/${existente._id}`);

  });
});
