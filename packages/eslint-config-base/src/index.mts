import type { Linter } from 'eslint';
import { dataConfig } from './data.mjs';
import { ignoreConfig } from './ignore.mjs';

/** ESLint configuration for generic TypeScript projects. */
const config: readonly Linter.FlatConfig[] = [...ignoreConfig, ...dataConfig];

export default config;
