import baseConfig from '@kurone-kito/eslint-config-base';
import type { Linter } from 'eslint';

/** ESLint configuration for generic React projects. */
const config: readonly Linter.FlatConfig[] = [...baseConfig];

export default config;
