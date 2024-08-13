import type { Linter } from 'eslint';
import pluginYaml from 'eslint-plugin-yaml';

/** The ESLint configuration for data language files. */
export const dataConfig: readonly Linter.FlatConfig[] = [
  (pluginYaml as any).configs.recommended,
];
