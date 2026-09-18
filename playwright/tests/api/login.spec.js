const { test, expect } = require('@playwright/test');
const { criarUsuario } = require('../../support/factories/dataFactory');
const { API_URL } = require('../../support/config');

test.describe('API Login', () => {
  let usuario;

  test.beforeEach(async ( { request } ) => {
    
    const dados = criarUsuario();
    const response = await request.post(`${API_URL}/usuarios`, { data: dados });
    const body = await response.json();
    usuario = { ...dados, _id: body._id };
  });

  test.afterEach(async ( { request } ) => {
    // Remove o usuário criado (limpeza).
    if (usuario && usuario._id) {
      await request.delete(`${API_URL}/usuarios/${usuario._id}`);
    }
  });

  test('autenticar usuario cadastrado e retornar token', async ({request}) => {
    const response = await request.post(`${API_URL}/login`, {
      data: { email: usuario.email, password: usuario.password },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toMatch(/^Bearer\s\S+$/);
  });

  test('retornar 401 ao usar senha invalida', async ({request}) => {
    const response = await request.post(`${API_URL}/login`, {
      data: {email: usuario.email, password: 'senha-incorreta'},
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.message).toBe('Email e/ou senha inválidos');
  });

  test('retornar 401 ao usar email nao cadastrado', async ({request}) => {
    const response = await request.post(`${API_URL}/login`, {
      data: {email: 'nao.cadastrado@serverest.dev', password: 'qualquer123'}, 
    });

    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.message).toBe('Email e/ou senha inválidos');
  });
});
