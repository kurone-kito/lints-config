import { strict as assert } from 'node:assert';
import { test } from 'node:test';

test("lint-staged-config's default export is a glob-to-commands map", async () => {
  // Imported inside the test body, not at module scope: `dist/index.mjs` is
  // a build artifact, and a static top-level import would abort the whole
  // file before this test can report a normal assertion failure.
  const { default: lintStagedConfig, useBiome } = await import(
    '../packages/lint-staged-config/dist/index.mjs'
  );
  assert.equal(lintStagedConfig, useBiome);
  assert.equal(typeof lintStagedConfig, 'object');
  const globs = Object.keys(lintStagedConfig);
  assert.ok(globs.length > 0, 'expected at least one glob entry');
  for (const glob of globs) {
    const commands = lintStagedConfig[glob];
    assert.ok(Array.isArray(commands), `${glob} must map to an array`);
    assert.ok(commands.length > 0, `${glob} must have at least one command`);
    for (const command of commands) {
      assert.equal(
        typeof command,
        'string',
        `${glob} commands must be strings`,
      );
    }
  }
});
