import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';

/** The directory of the current file. */
export const __dirname = dirname(fileURLToPath(import.meta.url));

/** The compatibility layer for ESLint configuration. */
export const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
});
