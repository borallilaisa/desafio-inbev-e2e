import { faker } from '@faker-js/faker';

const identificadorUnico = () => `${Date.now()}-${faker.number.int({ min: 1, max: 9999 })}`;

// Valor inexistente para os cenários de "não encontrado".
export const ID_INEXISTENTE = 'aaaaaaaaaaaaaaaa';

export const criarUsuario = (overrides = {}) => ({
  nome: faker.person.fullName(),
  email: `qa.${identificadorUnico()}@serverest.dev`,
  password: faker.internet.password({ length: 10 }),
  administrador: 'false',
  ...overrides,
});

export const criarProduto = (overrides = {}) => ({
  nome: `${faker.commerce.productName()} ${identificadorUnico()}`,
  preco: faker.number.int({ min: 1, max: 5000 }),
  descricao: faker.commerce.productDescription().slice(0, 80),
  quantidade: faker.number.int({ min: 10, max: 100 }),
  ...overrides,
});

export const criarCarrinho = (idProduto, quantidade = 1) => ({
  produtos: [{ idProduto, quantidade }],
});
