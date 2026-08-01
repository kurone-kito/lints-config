import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { commonPackedFiles, packages, packPackage } from './helpers.mjs';

for (const { name, expectedFiles } of packages) {
  test(`pnpm pack for @kurone-kito/${name} contains exactly the published files`, () => {
    const destDir = mkdtempSync(join(tmpdir(), `pack-${name}-`));
    try {
      const packed = packPackage(name, destDir);
      const actual = packed.files.map((file) => file.path).sort();
      const expected = [...expectedFiles, ...commonPackedFiles].sort();
      assert.deepEqual(actual, expected);
    } finally {
      rmSync(destDir, { recursive: true, force: true });
    }
  });
}
