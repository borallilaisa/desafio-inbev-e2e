const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const { criarUsuario } = require('../../support/factories/dataFactory');
const { API_URL } = require('../../support/config');

test.describe('FrontEnd Login', () => {
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

  test('autenticar com credenciais validas', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);

    await login.acessar();
    await login.autenticar(usuario.email, usuario.password);

    await expect(page).toHaveURL(/\/home$/);
    await expect(home.tituloLoja).toContainText('Serverest Store');
    await expect(home.botaoLogout).toBeVisible();

    const token = await page.evaluate(() =>
      localStorage.getItem('serverest/userToken'));
    expect(token).toBeTruthy();
  });

  test('nao autenticar com senha invalida', async ({ page }) => {
    const login = new LoginPage(page);

    await login.acessar();
    await login.autenticar(usuario.email, 'senhaerrada');

    await login.validarErro('Email e/ou senha inválidos');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirecionar ao login ao acessar sem autenticar', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL(/\/login$/);
  });
});
