// Page Object da tela de Cadastro de Usuário (/cadastrarusuarios).
const elements = {
  nome: '[data-testid="nome"]',
  email: '[data-testid="email"]',
  password: '[data-testid="password"]',
  administrador: '[data-testid="checkbox"]',
  cadastrar: '[data-testid="cadastrar"]',
  alertaSucesso: '.alert-primary',
  alertaErro: '[role="alert"]',
};

const RegisterPage = {
  acessar() {
    cy.visit('/cadastrarusuarios');
    return this;
  },
  preencherNome(nome) {
    cy.get(elements.nome).should('be.visible').clear();
    cy.get(elements.nome).type(nome);
    return this;
  },
  preencherEmail(email) {
    cy.get(elements.email).should('be.visible').clear();
    cy.get(elements.email).type(email);
    return this;
  },
  preencherSenha(senha) {
    cy.get(elements.password).should('be.visible').clear();
    cy.get(elements.password).type(senha);
    return this;
  },
  marcarComoAdministrador() {
    cy.get(elements.administrador).check();
    return this;
  },
  submeter() {
    cy.get(elements.cadastrar).click();
    return this;
  },
  cadastrar({ nome, email, password }, { administrador = false } = {}) {
    this.preencherNome(nome).preencherEmail(email).preencherSenha(password);
    if (administrador) {
      this.marcarComoAdministrador();
    }
    return this.submeter();
  },
  alertaSucesso() {
    return cy.get(elements.alertaSucesso);
  },
  alertaErro() {
    return cy.get(elements.alertaErro);
  },
};

export default RegisterPage;
