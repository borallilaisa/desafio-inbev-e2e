import http from './httpClient';

const loginApi = {
  autenticar: (credenciais) => http.request({ method: 'POST', url: '/login', body: credenciais }),
};

export default loginApi;
