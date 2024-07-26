import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import type { Linter } from 'eslint';

/** The configuration for ESLint to ignore files and directories. */
export const ignoreConfig: readonly Linter.FlatConfig[] = [
  ...['.gitignore', '.eslintignore']
    .map((file) => resolve(process.cwd(), file))
    .filter((file) => existsSync(file))
    .map((file) => includeIgnoreFile(file)),
  { ignores: ['.yarn/**/*', 'yarn.lock'] },
];
