import http from './httpClient';

const ROTA = '/carrinhos';

const carrinhosApi = {
  criar: (carrinho, token) =>
    http.request({ method: 'POST', url: ROTA, body: carrinho, headers: http.authHeader(token) }),
  listar: (filtros = {}) => http.request({ method: 'GET', url: ROTA, qs: filtros }),
  buscarPorId: (id) => http.request({ method: 'GET', url: `${ROTA}/${id}` }),
  concluirCompra: (token) =>
    http.request({ method: 'DELETE', url: `${ROTA}/concluir-compra`, headers: http.authHeader(token) }),
  cancelarCompra: (token) =>
    http.request({ method: 'DELETE', url: `${ROTA}/cancelar-compra`, headers: http.authHeader(token) }),
};

export default carrinhosApi;
