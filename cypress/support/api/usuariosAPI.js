import http from './httpClient';

const ROTA = '/usuarios';

const usuariosApi = {
  criar: (usuario) => http.request({ method: 'POST', url: ROTA, body: usuario }),
  listar: (filtros = {}) => http.request({ method: 'GET', url: ROTA, qs: filtros }),
  buscarPorId: (id) => http.request({ method: 'GET', url: `${ROTA}/${id}` }),
  atualizar: (id, usuario) => http.request({ method: 'PUT', url: `${ROTA}/${id}`, body: usuario }),
  excluir: (id) => http.request({ method: 'DELETE', url: `${ROTA}/${id}` }),
};

export default usuariosApi;
