import loginAPI from './api/loginAPI'
import produtosAPI from './api/produtosAPI'
import usuariosAPI from './api/usuariosAPI'
import LoginPage from './pages/LoginPage'
import { criarUsuario } from './factories/dataFactory';

const validarStatus = (response, statusEsperado, contexto) => {
  expect(response.status, `${contexto}: status HTTP`).to.eq(statusEsperado);
};

Cypress.Commands.add('criarUsuarioViaApi', (usuario) => {
  return usuariosAPI.criar(usuario).then((response) => {
    validarStatus(response, 201, `POST /usuarios (${usuario.email})`);
    return { ...usuario, _id: response.body._id };
  });
});
Cypress.Commands.add('excluirUsuarioViaApi', (id) => {
  if (!id) {
    return cy.wrap(null, { log: false });
  }
  return usuariosAPI.excluir(id).then((response) => {
    validarStatus(response, 200, `DELETE /usuarios/${id}`);
    return cy.wrap(response.body, { log: false });
  });
});

Cypress.Commands.add('autenticarViaApi', (email, password) => {
  return loginAPI.autenticar({ email, password }).then((response) => {
    validarStatus(response, 200, `POST /login (${email})`);
    return response.body.authorization;
  });
});

Cypress.Commands.add('criarAdminAutenticado', () => {
  const admin = criarUsuario({ administrador: 'true' });
  return cy.criarUsuarioViaApi(admin).then((criado) => {
    return cy.autenticarViaApi(criado.email, criado.password).then((token) => {
      return { ...criado, token };
    });
  });
});

Cypress.Commands.add('criarProdutoViaApi', (produto, token) => {
  return produtosAPI.criar(produto, token).then((response) => {
    validarStatus(response, 201, `POST /produtos (${produto.nome})`);
    return { ...produto, _id: response.body._id };
  });
});

Cypress.Commands.add('excluirProdutoViaApi', (id, token) => {
  if (!id) {
    return cy.wrap(null, { log: false });
  }
  return produtosAPI.excluir(id, token).then((response) => {
    validarStatus(response, 200, `DELETE /produtos/${id}`);
    return cy.wrap(response.body, { log: false });
  });
});

Cypress.Commands.add('login', (credenciais, { cacheSession = true } = {}) => {
  const realizarLogin = () => {
    LoginPage.acessar();
    LoginPage.autenticar(credenciais.email, credenciais.password);
    cy.location('pathname').should('eq', '/home');
  };

  if (cacheSession) {
    cy.session(credenciais.email, realizarLogin);
  } else {
    realizarLogin();
  }
});
