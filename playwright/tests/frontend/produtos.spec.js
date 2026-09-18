const { test, expect } = require('@playwright/test');
const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');
const { criarProduto, criarUsuario } = require('../../support/factories/dataFactory');

const API_URL = process.env.API_URL || 'https://serverest.dev';

test.describe('Frontend Pesquisa de produtos', () => {
  let admin;
  let produto;
  let usuario;

  test.beforeEach(async ({ page, request }) => {
    const dadosAdmin = criarUsuario({ administrador: 'true' });
    const respostaAdmin = await request.post(`${API_URL}/usuarios`, { data: dadosAdmin });
    const adminCriado = await respostaAdmin.json();
    const respostaLoginAdmin = await request.post(`${API_URL}/login`, {
      data: { email: dadosAdmin.email, password: dadosAdmin.password },
    });
    const loginAdmin = await respostaLoginAdmin.json();
    admin = { ...dadosAdmin, _id: adminCriado._id, token: loginAdmin.authorization };

    const dadosProduto = criarProduto();
    const respostaProduto = await request.post(`${API_URL}/produtos`, {
      data: dadosProduto,
      headers: { Authorization: admin.token },
    });
    const produtoCriado = await respostaProduto.json();
    produto = { ...dadosProduto, _id: produtoCriado._id };

    const dadosUsuario = criarUsuario();
    const respostaUsuario = await request.post(`${API_URL}/usuarios`, { data: dadosUsuario });
    const usuarioCriado = await respostaUsuario.json();
    usuario = { ...dadosUsuario, _id: usuarioCriado._id };

    const login = new LoginPage(page);
    await login.acessar();
    await login.autenticar(usuario.email, usuario.password);
    await expect(page).toHaveURL(/\/home$/);
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`${API_URL}/produtos/${produto._id}`, {
      headers: { Authorization: admin.token },
    });
    await request.delete(`${API_URL}/usuarios/${usuario._id}`);
    await request.delete(`${API_URL}/usuarios/${admin._id}`);
  });

  test('pesquisar produto existente e exibir o resultado correspondente', async ({ page }) => {
    const home = new HomePage(page);

    await home.visitar();
    await home.pesquisarProduto(produto.nome);

    await expect(home.cardDoProduto(produto.nome)).toBeVisible();
    await expect(home.cardDoProduto(produto.nome)).toContainText(produto.nome);
  });

  test('exibir mensagem quando nenhum produto é encontrado', async ({ page }) => {
    const home = new HomePage(page);

    await home.visitar();
    await home.pesquisarProduto('produto-que-nao-existe-xyz-987');

    await expect(home.mensagemNenhumProduto).toBeVisible();
  });
});
