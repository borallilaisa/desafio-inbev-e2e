import usuariosApi from '../../support/api/usuariosAPI';
import { criarUsuario, ID_INEXISTENTE } from '../../support/factories/dataFactory';

describe('API | Usuários', () => {
  it('cadastrar um usuário com sucesso (POST /usuarios)', () => {
    const usuario = criarUsuario({ administrador: 'true' });

    usuariosApi.criar(usuario).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string').and.not.be.empty;

      cy.excluirUsuarioViaApi(response.body._id);
    });
  });

  it('não cadastrar usuário se e-mail já utilizado (POST /usuarios)', () => {
    const usuario = criarUsuario();
    cy.criarUsuarioViaApi(usuario).then((criado) => {
      usuariosApi.criar(criarUsuario({ email: usuario.email })).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Este email já está sendo usado');

        cy.excluirUsuarioViaApi(criado._id);
      });
    });
  });

  it('listar usuários e filtrar por e-mail (GET /usuarios)', () =>{
    const usuario = criarUsuario();
    cy.criarUsuarioViaApi(usuario).then((criado) => {
      usuariosApi.listar({ email: usuario.email }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.quantidade).to.equal(1);
        expect(response.body.usuarios[0]).to.include({
          nome: usuario.nome,
          email: usuario.email,
          administrador: usuario.administrador,
        });

        cy.excluirUsuarioViaApi(criado._id);
      });
    });
  });

  it('buscar um usuário pelo id (GET /usuarios/{_id})', () => {
    const usuario = criarUsuario();
    cy.criarUsuarioViaApi(usuario).then((criado) => {
      usuariosApi.buscarPorId(criado._id).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.include({ _id: criado._id, email: usuario.email, nome: usuario.nome });

        cy.excluirUsuarioViaApi(criado._id);
      });
    });
  });

  it('retornar 400 buscando um usuário inexistente (GET /usuarios/{_id})', () => {
    usuariosApi.buscarPorId(ID_INEXISTENTE).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Usuário não encontrado');
    });
  });

  it('atualizar usuário existente (PUT /usuarios/{_id})', () => {
    const usuario = criarUsuario();
    cy.criarUsuarioViaApi(usuario).then((criado) => {
      const dadosAtualizados = { ...criarUsuario(), email: usuario.email };
      usuariosApi.atualizar(criado._id, dadosAtualizados).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Registro alterado com sucesso');

        usuariosApi.buscarPorId(criado._id).then((consulta) => {
          expect(consulta.body.nome).to.equal(dadosAtualizados.nome);
          cy.excluirUsuarioViaApi(criado._id);
        });
      });
    });
  });

  it('cadastrar novo usuário ao atualizar um id inexistente (PUT /usuarios/{_id})', () => {
    const usuario = criarUsuario();
    usuariosApi.atualizar('id-inexistente-999', usuario).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string');

      cy.excluirUsuarioViaApi(response.body._id);
    });
  });

  it('excluir um usuário com sucesso (DELETE /usuarios/{_id})', () => {
    const usuario = criarUsuario();
    cy.criarUsuarioViaApi(usuario).then((criado) => {
      usuariosApi.excluir(criado._id).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Registro excluído com sucesso');

        usuariosApi.buscarPorId(criado._id).then((consulta) => {
          expect(consulta.status).to.equal(400);
        });
      });
    });
  });

  it('informar "Nenhum registro excluído" ao remover usuário inexistente', () => {
    usuariosApi.excluir(ID_INEXISTENTE).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Nenhum registro excluído');
    });
  });
});
