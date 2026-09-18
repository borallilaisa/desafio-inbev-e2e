const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByTestId('email');      // getByTestId -> data-testid
    this.senha = page.getByTestId('senha');
    this.entrar = page.getByTestId('entrar');
    this.alertaErro = page.locator('[role="alert"]');
  }

  async acessar() { await this.page.goto('/login'); }

  async autenticar(email, senha) {
    await this.email.fill(email);
    await this.senha.fill(senha);
    await this.entrar.click();
  }

  async validarErro(mensagem) {
    await expect(this.alertaErro).toBeVisible();
    await expect(this.alertaErro).toContainText(mensagem);
  }
}
module.exports = LoginPage;
