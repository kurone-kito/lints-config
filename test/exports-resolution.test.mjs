import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { packageDir, packages } from './helpers.mjs';

function collectExportTargets(exportsField) {
  if (typeof exportsField === 'string') {
    return [exportsField];
  }
  if (exportsField && typeof exportsField === 'object') {
    return Object.values(exportsField).flatMap(collectExportTargets);
  }
  return [];
}

for (const { name } of packages) {
  test(`@kurone-kito/${name}'s exports map resolves to real files`, () => {
    const dir = packageDir(name);
    const manifest = JSON.parse(
      readFileSync(join(dir, 'package.json'), 'utf8'),
    );
    const targets = new Set(collectExportTargets(manifest.exports));
    assert.ok(targets.size > 0, 'expected at least one exports target');
    for (const target of targets) {
      const filePath = join(dir, target);
      assert.ok(existsSync(filePath), `${target} does not exist`);
      if (target.endsWith('.json')) {
        assert.doesNotThrow(
          () => JSON.parse(readFileSync(filePath, 'utf8')),
          `${target} is not valid JSON`,
        );
      }
    }
  });
}
