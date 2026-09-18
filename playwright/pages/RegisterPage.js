class RegisterPage{
  constructor(page){
    this.page = page;
    this.nome = page.getByTestId('nome');
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.administrador = page.getByTestId('checkbox');
    this.botaoCadastrar = page.getByTestId('cadastrar');
    this.alertaSucesso = page.locator('.alert-primary');
    this.alertaErro = page.locator('[role="alert"]');
  }

  async acessar(){
    await this.page.goto('/cadastrarusuarios');
  }

  async cadastrar({ nome, email, password, administrador }) {
    await this.nome.fill(nome);
    await this.email.fill(email);
    await this.password.fill(password);

    if (administrador === 'true') {
      await this.administrador.check();
    }

    await this.botaoCadastrar.click();
  }
}
  module.exports = RegisterPage;

