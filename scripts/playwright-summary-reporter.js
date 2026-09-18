const fs = require('fs');

class PlaywrightSummaryReporter {
  onBegin() {
    this.startTime = Date.now();
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.flaky = 0;
    this.failures = [];
  }

  onTestEnd(test, result) {
    const title = test.titlePath().filter(Boolean).join(' > ');
    const location = `${test.location.file}:${test.location.line}`;

    if (result.status === 'passed') {
      if (result.retry > 0) {
        this.flaky += 1;
      } else {
        this.passed += 1;
      }
    } else if (result.status === 'skipped') {
      this.skipped += 1;
    } else {
      this.failed += 1;
      this.failures.push({ title, location });
    }
  }

  onEnd() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);

    const lines = [
      '## Resultado dos testes - Playwright',
      '',
      '| Metrica | Quantidade |',
      '| --- | --- |',
      `| Passou | ${this.passed} |`,
      `| Falhou | ${this.failed} |`,
      `| Flaky | ${this.flaky} |`,
      `| Ignorado | ${this.skipped} |`,
      `| Duracao (s) | ${duration} |`,
    ];

    if (this.failures.length > 0) {
      lines.push('', '### Testes que falharam', '', '| Teste | Local |', '| --- | --- |');
      for (const item of this.failures) {
        lines.push(`| ${item.title} | ${item.location} |`);
      }
    }

    lines.push('');
    const summary = lines.join('\n');

    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
    }

    process.stdout.write(`\n${summary}`);
  }
}

module.exports = PlaywrightSummaryReporter;
