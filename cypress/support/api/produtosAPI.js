import http from './httpClient';

const ROTA = '/produtos';

const produtosApi = {
  criar: (produto, token) =>
    http.request({ method: 'POST', url: ROTA, body: produto, headers: http.authHeader(token) }),
  listar: (filtros = {}) => http.request({ method: 'GET', url: ROTA, qs: filtros }),
  buscarPorId: (id) => http.request({ method: 'GET', url: `${ROTA}/${id}` }),
  atualizar: (id, produto, token) =>
    http.request({ method: 'PUT', url: `${ROTA}/${id}`, body: produto, headers: http.authHeader(token) }),
  excluir: (id, token) =>
    http.request({ method: 'DELETE', url: `${ROTA}/${id}`, headers: http.authHeader(token) }),
};

export default produtosApi;
