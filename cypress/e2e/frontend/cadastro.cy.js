import RegisterPage from '../../support/pages/RegisterPage';
import usuariosApi from '../../support/api/usuariosAPI';
import { criarUsuario } from '../../support/factories/dataFactory';

describe('Frontend | Cadastro de usuário', () => {

  it('cadastrar novo usuario com sucesso', () => {
    //funçao que cria os dados para o usuario
    const usuario = criarUsuario();

    RegisterPage.acessar();
    RegisterPage.cadastrar(usuario);

    RegisterPage.alertaSucesso().should('be.visible').and('contain.text', 'Cadastro realizado com sucesso');

    usuariosApi.listar({email: usuario.email}).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.quantidade).to.equal(1);


      cy.excluirUsuarioViaApi(response.body.usuarios[0]._id);

    });
  });

  it('nao cadastrar com email existente', () =>{
    const usuarioExistente = criarUsuario();
    cy.criarUsuarioViaApi(usuarioExistente).then((criado) => {
      RegisterPage.acessar();
      RegisterPage.cadastrar(criarUsuario({ email: usuarioExistente.email, password: 'senha12345' }));

      RegisterPage.alertaErro().should('be.visible').and('contain.text', 'Este email já está sendo usado');

      cy.excluirUsuarioViaApi(criado._id);
    });
  });

});
