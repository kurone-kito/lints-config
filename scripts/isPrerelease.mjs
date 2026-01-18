#!/usr/bin/env node

import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { prerelease } from 'semver';

const [, bin, version, pre] = process.argv;
if (fileURLToPath(import.meta.url) !== realpathSync(bin)) {
  throw new Error('This script cannot be imported.');
}
const unstable = !!prerelease(JSON.parse(version));
process.exitCode = (unstable ? pre : !pre) ? 0 : 1;
