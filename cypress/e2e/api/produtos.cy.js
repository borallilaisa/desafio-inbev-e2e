import produtosApi from '../../support/api/produtosAPI';
import { criarProduto, criarUsuario, ID_INEXISTENTE } from '../../support/factories/dataFactory';

describe('API | Produtos', () => {
  let admin;
  const produtosCriados = [];

  beforeEach(() => {
    cy.criarAdminAutenticado().then((criado) => {
      admin = criado;
    });
  });

  afterEach(() => {
    cy.wrap(produtosCriados, { log: false }).each((id) => cy.excluirProdutoViaApi(id, admin.token));
    cy.excluirUsuarioViaApi(admin._id);
  });

  const criarProdutoRegistrado = (overrides = {}) => {
    return cy.criarProdutoViaApi(criarProduto(overrides), admin.token).then((produto) => {
      produtosCriados.push(produto._id);
      return produto;
    });
  };

  it('cadastrar um produto com administrador autenticado (POST /produtos)', () => {
    criarProdutoRegistrado().then((produto) => {
      expect(produto._id).to.be.a('string').and.not.be.empty;

      produtosApi.buscarPorId(produto._id).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.include({
          nome: produto.nome,
          preco: produto.preco,
          quantidade: produto.quantidade,
        });
      });
    });
  });

  it('não cadastrar produto sem token (POST /produtos)', () => {
    produtosApi.criar(criarProduto(), undefined).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal(
        'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
      );
    });
  });

  it('não permitir cadastro por usuário não administrador (POST /produtos)', () => {
    const usuarioComum = criarUsuario({ administrador: 'false' });
    cy.criarUsuarioViaApi(usuarioComum).then((criado) => {
      cy.autenticarViaApi(criado.email, criado.password).then((tokenComum) => {
        produtosApi.criar(criarProduto(), tokenComum).then((response) => {
          expect(response.status).to.equal(403);
          expect(response.body.message).to.equal('Rota exclusiva para administradores');
          cy.excluirUsuarioViaApi(criado._id);
        });
      });
    });
  });

  it('não  cadastrar dois produtos com o mesmo nome (POST /produtos)', () => {
    criarProdutoRegistrado().then((produto) => {
      produtosApi.criar(criarProduto({ nome: produto.nome }), admin.token).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Já existe produto com esse nome');
      });
    });
  });

  it('listar produtos e permitir filtrar por nome (GET /produtos)', () => {
    criarProdutoRegistrado().then((produto) => {
      produtosApi.listar({ nome: produto.nome }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.quantidade).to.equal(1);
        expect(response.body.produtos[0]).to.include({ nome: produto.nome, _id: produto._id });
      });
    });
  });

  it('retornar 400 ao buscar um produto inexistente (GET /produtos/{_id})', () => {
    produtosApi.buscarPorId(ID_INEXISTENTE).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Produto não encontrado');
    });
  });

  it('atualizar um produto existente (PUT /produtos/{_id})', () => {
    criarProdutoRegistrado().then((produto) => {
      const dadosAtualizados = criarProduto({ nome: `${produto.nome}-editado` });
      produtosApi.atualizar(produto._id, dadosAtualizados, admin.token).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Registro alterado com sucesso');

        produtosApi.buscarPorId(produto._id).then((consulta) => {
          expect(consulta.body).to.include({
            nome: dadosAtualizados.nome,
            preco: dadosAtualizados.preco,
          });
        });
      });
    });
  });

  it('excluir um produto existente (DELETE /produtos/{_id})', () => {
    criarProdutoRegistrado().then((produto) => {
      produtosApi.excluir(produto._id, admin.token).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Registro excluído com sucesso');

        produtosApi.buscarPorId(produto._id).then((consulta) => {
          expect(consulta.status).to.equal(400);
        });
      });
    });
  });

  it('informar "Nenhum registro excluído" ao remover produto inexistente', () => {
    produtosApi.excluir(ID_INEXISTENTE, admin.token).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Nenhum registro excluído');
    });
  });
});
