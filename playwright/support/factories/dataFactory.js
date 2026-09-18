const { faker } = require('@faker-js/faker');

const identificadorUnico = () => `${Date.now()}-${faker.number.int({ min: 1, max: 9999 })}`;

const ID_INEXISTENTE = 'aaaaaaaaaaaaaaaa';

const criarUsuario = (overrides = {}) => ({
  nome: faker.person.fullName(),
  email: `qa.${identificadorUnico()}@serverest.dev`,
  password: faker.internet.password({ length: 10 }),
  administrador: 'false',
  ...overrides,
});

const criarProduto = (overrides = {}) => ({
  nome: `${faker.commerce.productName()} ${identificadorUnico()}`,
  preco: faker.number.int({ min: 1, max: 5000 }),
  descricao: faker.commerce.productDescription().slice(0, 80),
  quantidade: faker.number.int({ min: 10, max: 100 }),
  ...overrides,
});

module.exports = { criarUsuario, criarProduto, ID_INEXISTENTE };

