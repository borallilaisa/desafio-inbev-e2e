const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join('test-results', 'results.json');

function collectFailedSpecs(suites, prefix, out) {
  for (const suite of suites || []) {
    const titles = [...prefix, suite.title].filter(Boolean);

    for (const spec of suite.specs || []) {
      const hasFailure =
        spec.ok === false ||
        (spec.tests || []).some((t) => t.status === 'unexpected' || t.status === 'flaky');

      if (hasFailure) {
        out.push({
          title: [...titles, spec.title].filter(Boolean).join(' > '),
          location: spec.file ? `${spec.file}:${spec.line ?? 0}` : '',
        });
      }
    }

    collectFailedSpecs(suite.suites, titles, out);
  }
}

function buildSummary(report) {
  const stats = report.stats || {};
  const expected = stats.expected ?? 0;
  const unexpected = stats.unexpected ?? 0;
  const flaky = stats.flaky ?? 0;
  const skipped = stats.skipped ?? 0;
  const durationMs = Math.round(stats.duration ?? 0);

  const lines = [
    '## Resultado dos testes - Playwright',
    '',
    '| Metrica | Quantidade |',
    '| --- | --- |',
    `| Passou | ${expected} |`,
    `| Falhou | ${unexpected} |`,
    `| Flaky | ${flaky} |`,
    `| Ignorado | ${skipped} |`,
    `| Duracao (ms) | ${durationMs} |`,
  ];

  const failed = [];
  collectFailedSpecs(report.suites, [], failed);

  if (failed.length > 0) {
    lines.push('', '### Testes que falharam', '', '| Teste | Local |', '| --- | --- |');
    for (const item of failed) {
      lines.push(`| ${item.title} | ${item.location} |`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.log(`Arquivo ${RESULTS_FILE} nao encontrado. Nada a resumir.`);
    return;
  }

  const report = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  const summary = buildSummary(report);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }

  console.log(summary);
}

main();
