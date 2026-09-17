const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.FRONTEND_URL || 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      apiUrl: process.env.API_URL || 'https://serverest.dev',
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
