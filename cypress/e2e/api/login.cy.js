import loginApi from '../../support/api/loginAPI';
import { criarUsuario } from '../../support/factories/dataFactory';

describe('API | Login', () => {
  let usuario;

  beforeEach(() => {
    usuario = criarUsuario();
    cy.criarUsuarioViaApi(usuario).then((criado) => {
      usuario = criado;
    });
  });

  afterEach(() => {
    cy.excluirUsuarioViaApi(usuario._id);
  });

  it('autenticar usuário cadastrado e retornar o token', () => {
    loginApi.autenticar({ email: usuario.email, password: usuario.password }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Login realizado com sucesso');
      expect(response.body.authorization).to.match(/^Bearer\s\S+$/);
    });
  });

  it('retornar 401 ao autenticar com senha inválida', () => {
    loginApi.autenticar({ email: usuario.email, password: 'senhaincorreta' }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Email e/ou senha inválidos');
    });
  });

  it('retornar 401 ao autenticar com e-mail não cadastrado', () => {
    loginApi
      .autenticar({ email: 'nao.cadastrado@serverest.dev', password: 'qualquer123' })
      .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Email e/ou senha inválidos');
      });
  });
});
