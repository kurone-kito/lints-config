import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { packageDir, resolveBin, runBin } from './helpers.mjs';

function withTempDir(run) {
  const dir = mkdtempSync(join(tmpdir(), 'lints-config-fixture-'));
  try {
    return run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('the generated biome.json accepts a fixture through `extends`', () => {
  withTempDir((dir) => {
    // biome-config's own biome.json is `"root": false` (it is meant to be
    // extended, not run standalone), so it is exercised the way a real
    // consumer would use it: through a wrapping root config.
    writeFileSync(
      join(dir, 'biome.jsonc'),
      JSON.stringify({
        extends: [join(packageDir('biome-config'), 'biome.json')],
        vcs: { enabled: false, useIgnoreFile: false },
      }),
    );
    const fixture = join(dir, 'fixture.js');
    writeFileSync(fixture, "export const greeting = 'hello';\n");
    const biome = resolveBin('@biomejs/biome', 'biome');
    const result = runBin(biome, ['check', '--config-path', dir, fixture]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
});

test('the generated cspell.config.json accepts a fixture', () => {
  withTempDir((dir) => {
    writeFileSync(
      join(dir, 'fixture.txt'),
      'Hello world. This is a test file for cspell verification.\n',
    );
    const cspell = resolveBin('cspell', 'cspell');
    const configPath = join(packageDir('cspell-config'), 'cspell.config.json');
    // cspell resolves the config's `globRoot: "${cwd}"` against the process
    // cwd, so the fixture must be linted relative to that same directory.
    const result = runBin(
      cspell,
      ['lint', '--no-progress', '--config', configPath, 'fixture.txt'],
      { cwd: dir },
    );
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
});

test('the generated .markdownlint.json accepts a fixture', () => {
  withTempDir((dir) => {
    const fixture = join(dir, 'fixture.md');
    writeFileSync(fixture, '# Fixture\n\nA short line.\n');
    const markdownlintCli2 = resolveBin(
      'markdownlint-cli2',
      'markdownlint-cli2',
    );
    const configPath = join(
      packageDir('markdownlint-config'),
      '.markdownlint.json',
    );
    const result = runBin(markdownlintCli2, ['--config', configPath, fixture]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
});

test('the generated .markdownlint.json allows repeated heading text under different parents (siblings_only)', () => {
  withTempDir((dir) => {
    // Same changelog shape as the MD024 doc example: repeated "### Features"
    // headings are fine here because each has a different parent heading.
    const fixture = join(dir, 'fixture.md');
    writeFileSync(
      fixture,
      [
        '# Change log',
        '',
        '## 1.0.0',
        '',
        '### Features',
        '',
        '- Initial release.',
        '',
        '## 2.0.0',
        '',
        '### Features',
        '',
        '- Second release.',
        '',
      ].join('\n'),
    );
    const markdownlintCli2 = resolveBin(
      'markdownlint-cli2',
      'markdownlint-cli2',
    );
    const configPath = join(
      packageDir('markdownlint-config'),
      '.markdownlint.json',
    );
    const result = runBin(markdownlintCli2, ['--config', configPath, fixture]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
});

test('the generated .markdownlint.json flags duplicate headings under the same parent', () => {
  withTempDir((dir) => {
    const fixture = join(dir, 'fixture.md');
    writeFileSync(
      fixture,
      [
        '# Change log',
        '',
        '## Features',
        '',
        '- First.',
        '',
        '## Features',
        '',
        '- Second.',
        '',
      ].join('\n'),
    );
    const markdownlintCli2 = resolveBin(
      'markdownlint-cli2',
      'markdownlint-cli2',
    );
    const configPath = join(
      packageDir('markdownlint-config'),
      '.markdownlint.json',
    );
    const result = runBin(markdownlintCli2, ['--config', configPath, fixture]);
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, /MD024/);
  });
});

test('the generated .commitlintrc.json accepts a conventional commit message', () => {
  const commitlint = resolveBin('@commitlint/cli', 'commitlint');
  const configPath = join(
    packageDir('commitlint-config'),
    '.commitlintrc.json',
  );
  const result = runBin(commitlint, ['--config', configPath], {
    input: 'feat: add fixture for commitlint verification\n',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('the generated .commitlintrc.json rejects a non-conventional commit message', () => {
  const commitlint = resolveBin('@commitlint/cli', 'commitlint');
  const configPath = join(
    packageDir('commitlint-config'),
    '.commitlintrc.json',
  );
  const result = runBin(commitlint, ['--config', configPath], {
    input: 'not a conventional commit message\n',
  });
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
});
