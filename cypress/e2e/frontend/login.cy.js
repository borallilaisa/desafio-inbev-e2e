import HomePage from '../../support/pages/HomePage';
import LoginPage from '../../support/pages/LoginPage';
import { criarUsuario } from '../../support/factories/dataFactory';
//importando elementos da pagina, e a funçao de criar dados aleatorios para o usuario


describe('Frontend | Cadastro', () => {
  let usuario;

  //gerando dados de usuario na factory e criando via API antes de fazer o login
  beforeEach(() => {
    usuario = criarUsuario();
    cy.criarUsuarioViaApi(usuario).then((criado) => {
    usuario = criado;
    });
  });

  //deleta usuario apos teste do login
  afterEach(() => {
    cy.excluirUsuarioViaApi(usuario._id);
  });


  it('autenticar com credenciais validas', ()=> {
     cy.login({ email: usuario.email, password: usuario.password }, { cacheSession: false });

     cy.location('pathname').should('eq', '/home');
     HomePage.tituloLoja().should('contain.text', 'Serverest Store');
     HomePage.botaoLogout().should('be.visible');

     cy.window().then((win) => {
      expect(win.localStorage.getItem('serverest/userToken')).to.be.a('string').and.not.be.empty;
    });
  });

  it('nao autentiticar com senha incorreta', ()=> {
    LoginPage.acessar();
    LoginPage.autenticar(usuario.email, 'senha-errada');

    LoginPage.alertaErro().should('be.visible').and('contain.text', 'Email e/ou senha inválidos');
    cy.location('pathname').should('eq', '/login');

  });

  it('redirecionar para login ao acessar home sem autenticaçao', ()=>{
    cy.visit('/home');
     cy.location('pathname').should('eq', '/login');
  });
});
