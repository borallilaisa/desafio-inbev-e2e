# Desafio InBev E2E

Projeto de automação de testes **E2E (Frontend + API)** da aplicação [ServeRest](https://serverest.dev), implementado com **Cypress** e **Playwright**.

A mesma suíte é replicada nas duas ferramentas para fins de estudo/comparação: cenários de **API** (contratos e regras de negócio) e de **Frontend** (fluxos de usuário na interface).

## Tecnologias

- [Node.js](https://nodejs.org/) (18+)
- [Cypress](https://www.cypress.io/) 13
- [Playwright](https://playwright.dev/) 1.48
- [Faker](https://fakerjs.dev/) para geração de massa de dados
- [ESLint](https://eslint.org/) para padronização de código

## Cobertura de testes

| Área     | Cenários                                                                                     | Cypress  | Playwright |
| -------- | -------------------------------------------------------------------------------------------- | -------- | ---------- |
| API      | Cadastro, listagem, busca, atualização e exclusão de usuários                                 | ✅       | ✅         |
| API      | Autenticação (credenciais válidas/inválidas, e-mail inexistente)                              | ✅       | ✅         |
| API      | CRUD de produtos, regras de admin, token inválido e nome duplicado                             | ✅       | ✅         |
| Frontend | Cadastro de usuário (sucesso e e-mail duplicado)                                              | ✅       | ✅         |
| Frontend | Login (sucesso, senha inválida e redirecionamento sem autenticação)                            | ✅       | ✅         |
| Frontend | Pesquisa de produtos (existente e inexistente)                                                | ✅       | ✅         |

## Estrutura do projeto

```
desafio-inbev-e2e/
├─ cypress/
│  ├─ e2e/
│  │  ├─ api/                # Testes de API (usuario, login, produtos)
│  │  └─ frontend/           # Testes de interface (cadastro, login, produtos)
│  └─ support/
│     ├─ api/                # httpClient + clients por recurso
│     ├─ pages/              # Page Objects
│     ├─ factories/          # dataFactory (Faker)
│     ├─ commands.js         # Custom commands
│     └─ e2e.js              # Arquivo de suporte
├─ playwright/
│  ├─ pages/                 # Page Objects
│  ├─ support/               # config.js + factories
│  └─ tests/
│     ├─ api/                # Testes de API
│     └─ frontend/           # Testes de interface
├─ .github/workflows/ci.yml  # Pipeline de CI
├─ cypress.config.js
├─ playwright.config.js
└─ package.json
```

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

Para o Playwright, instale também o navegador (Chromium):

```bash
npm run pw:install
```

## Variáveis de ambiente

Ambas têm valores padrão apontando para o ambiente público do ServeRest, então não é obrigatório configurá-las.

| Variável       | Padrão                          | Descrição                        |
| -------------- | ------------------------------- | -------------------------------- |
| `FRONTEND_URL` | `https://front.serverest.dev`   | URL base do frontend             |
| `API_URL`      | `https://serverest.dev`         | URL base da API                  |

Exemplo (PowerShell):

```powershell
$env:API_URL = "https://serverest.dev"
$env:FRONTEND_URL = "https://front.serverest.dev"
```

## Como executar

### Cypress

```bash
npm run cy:open          # modo interativo
npm run cy:run           # execução headless (todos os testes)
npm run cy:run:api       # somente testes de API
npm run cy:run:frontend  # somente testes de frontend
```

### Playwright

```bash
npm run pw:test           # todos os testes
npm run pw:test:api       # somente testes de API
npm run pw:test:frontend  # somente testes de frontend
npm run pw:report         # abre o relatório HTML
```

### Todos

```bash
npm test                  # Cypress + Playwright
```

## Relatórios e artefatos

- **Playwright**: relatório HTML em `playwright-report/` (via `npm run pw:report`) e artefatos de falha em `test-results/`.
- **Cypress**: screenshots em `cypress/screenshots/` quando há falha.

## Integração contínua

O pipeline (`.github/workflows/ci.yml`) é executado em `push` e `pull_request` para as branches `master`/`main` e também manualmente (`workflow_dispatch`). Ele roda dois jobs em paralelo:

- **Cypress**: instala dependências e executa `cypress run` (Chrome headless).
- **Playwright**: instala o Chromium e executa `playwright test`.

Os relatórios e artefatos são publicados como _artifacts_ do workflow. O job do Playwright também publica um **resumo dos testes** na página do run (Job Summary do GitHub Actions) e anotações de falha no PR, gerados a partir de `test-results/results.json` pelo script `scripts/playwright-summary.js`.

## Autor

Laisa Boralli

## Licença

MIT
