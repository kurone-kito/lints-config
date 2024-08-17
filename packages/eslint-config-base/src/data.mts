import type { Linter } from 'eslint';
// @ts-ignore
import json from 'eslint-plugin-json';
import pluginYaml from 'eslint-plugin-yaml';

/** The ESLint configuration for data language files. */
export const dataConfig: readonly Linter.Config[] = [
  { files: ['**/*.json'], ...json.configs['recommended'] },
  (pluginYaml as any).configs.recommended,
];
