// Page Object da Home do usuário (/home).
const elements = {
  tituloLoja: 'h1', // "Serverest Store"
  campoPesquisa: '[data-testid="pesquisar"]',
  botaoPesquisar: '[data-testid="botaoPesquisar"]',
  cards: '.card',
  cardTitle: '[class="card-title negrito"]',
  adicionarNaLista: '[data-testid="adicionarNaLista"]',
  logout: '[data-testid="logout"]',
};

const HomePage = {
  visitar() {
    cy.visit('/home');
    return this;
  },
  tituloLoja() {
    return cy.get(elements.tituloLoja);
  },
  botaoLogout() {
    return cy.get(elements.logout);
  },
  pesquisarProduto(termo) {
    cy.get(elements.campoPesquisa).should('be.visible').clear();
    cy.get(elements.campoPesquisa).type(termo);
    cy.get(elements.botaoPesquisar).click();
    return this;
  },
  cardDoProduto(nome) {
    return cy.contains(elements.cardTitle, nome);
  },
  adicionarProdutoNaLista(nome) {
    this.cardDoProduto(nome).find(elements.adicionarNaLista).click();
    return this;
  },
  mensagemNenhumProduto() {
    return cy.contains('Nenhum produto foi encontrado');
  },
};

export default HomePage;
