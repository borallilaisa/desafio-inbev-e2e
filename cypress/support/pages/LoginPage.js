// Page Object da tela de Login (/login).
const elements = {
  email: '[data-testid="email"]',
  senha: '[data-testid="senha"]',
  entrar: '[data-testid="entrar"]',
  linkCadastro: '[data-testid="cadastrar"]',
  alertaErro: '[role="alert"]',
};

//funções
const LoginPage = {
  acessar() {
    cy.visit('/login');
    return this;
  },
  preencherEmail(email) {
    cy.get(elements.email).should('be.visible').clear();
    cy.get(elements.email).type(email);
    return this;
  },
  preencherSenha(senha) {
    cy.get(elements.senha).should('be.visible').clear();
    cy.get(elements.senha).type(senha);
    return this;
  },
  submeter() {
    cy.get(elements.entrar).click();
    return this;
  },
  autenticar(email, senha) {
    return this.preencherEmail(email).preencherSenha(senha).submeter();
  },
  irParaCadastro() {
    cy.get(elements.linkCadastro).click();
    return this;
  },
  alertaErro() {
    return cy.get(elements.alertaErro);
  },
};

export default LoginPage;
