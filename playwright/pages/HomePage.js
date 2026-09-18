class HomePage{
  constructor(page) {
    this.page = page;
    this.tituloLoja = page.locator('h1'); // "Serverest Store"
    this.campoPesquisa = page.getByTestId('pesquisar');
    this.botaoPesquisar = page.getByTestId('botaoPesquisar');
    this.adicionarNaLista = page.getByTestId('adicionarNaLista');
    this.botaoLogout = page.getByTestId('logout');
    this.mensagemNenhumProduto = page.getByText('Nenhum produto foi encontrado');
  }

  async visitar(){
    await this.page.goto('/home');
  }

  cardDoProduto(nome){
    return this.page.locator('.card', {hasText:nome});
  }

  async pesquisarProduto(termo){
    await this.campoPesquisa.fill(termo);
    await this.botaoPesquisar.click();
  }
}

module.exports = HomePage;
