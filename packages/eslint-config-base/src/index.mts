import type { Linter } from 'eslint';
import { dataConfig } from './data.mjs';

/** ESLint configuration for generic TypeScript projects. */
const config: readonly Linter.FlatConfig[] = [...dataConfig];

export default config;
