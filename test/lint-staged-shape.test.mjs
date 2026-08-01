import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import lintStagedConfig, {
  useBiome,
} from '../packages/lint-staged-config/dist/index.mjs';

test("lint-staged-config's default export is a glob-to-commands map", () => {
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
