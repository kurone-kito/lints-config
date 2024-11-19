import json from '@eslint/json';
import type { Linter } from 'eslint';
import pluginYaml from 'eslint-plugin-yaml';

/** The ESLint configuration for data language files. */
export const dataConfig: readonly Linter.Config[] = [
  {
    files: ['**/tsconfig.json', '**/*.jsonc'],
    ignores: ['package-lock.json'],
    language: 'json/jsonc',
    ...json.configs.recommended,
  },
  {
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },
  // @ts-expect-error
  pluginYaml.configs.recommended,
];
