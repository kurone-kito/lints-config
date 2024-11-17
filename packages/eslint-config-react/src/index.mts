import baseConfig from '@kurone-kito/eslint-config-base';
import type { TSESLint } from '@typescript-eslint/utils';
// @ts-expect-error
import stylelintConfig from 'eslint-config-stylelint';
import tsEslint from 'typescript-eslint';
import { additionalReactConfig, reactConfig } from './react.mjs';
import { storybookConfig } from './storybook.mjs';
import { compat } from './utils.mjs';

/**
 * The ESLint configuration for the base rules.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/47663}
 */
const config: TSESLint.FlatConfig.ConfigArray = tsEslint.config(
  ...([
    ...reactConfig,
    ...stylelintConfig,
    ...compat.extends('airbnb'),
    ...compat.extends('@kesills/airbnb-typescript'),
    ...baseConfig,
    ...additionalReactConfig,
    ...storybookConfig,
    { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  ] as tsEslint.ConfigWithExtends[]),
);

export default config;
