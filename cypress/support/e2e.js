import './commands';

// Ignora erros não tratados 
Cypress.on('uncaught:exception', (err, runnable) => {
    return false; 
  });
