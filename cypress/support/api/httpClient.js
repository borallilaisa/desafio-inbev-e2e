const baseUrl = () => Cypress.env('apiUrl');

function request({ method = 'GET', url, body, qs, headers } = {}) {
  return cy.request({
    method,
    url: `${baseUrl()}${url}`,
    body,
    qs,
    headers,
    failOnStatusCode: false, // permite validar cenários de erro (400/401/403)
  });
}

// Header de autenticação no formato "Bearer <token>".
const authHeader = (token) => (token ? { Authorization: token } : undefined);

export default { request, authHeader, baseUrl };
