import HomePage from '../../support/pages/HomePage';
import { criarProduto, criarUsuario } from '../../support/factories/dataFactory';

describe('Frontend | Pesquisa de produtos', () => {
  let admin;
  let usuario;
  let produto;

before(() => {
    cy.criarAdminAutenticado().then((adminCriado) => {
      admin = adminCriado;
      cy.criarProdutoViaApi(criarProduto(), admin.token).then((produtoCriado) => {
        produto = produtoCriado;
      });
    });
    cy.criarUsuarioViaApi(criarUsuario()).then((usuarioCriado) => {
      usuario = usuarioCriado;
    });
  });

  after(() =>{
    cy.excluirProdutoViaApi(produto._id, admin.token);
    cy.excluirUsuarioViaApi(usuario._id);
    cy.excluirUsuarioViaApi(admin._id);
  });

  beforeEach(() => {
    cy.login({email: usuario.email, password: usuario.password});

  });

  it('pesquisar produto existente', ()=>{
    HomePage.visitar();
    HomePage.pesquisarProduto(produto.nome);

    HomePage.cardDoProduto(produto.nome).should('be.visible').and('contain.text', produto.nome);

  });

  it('pesquisar produto inexistente', ()=> {
    HomePage.visitar();
    HomePage.pesquisarProduto('produto-nao-existente');

    HomePage.mensagemNenhumProduto().should('be.visible');
  });

});
