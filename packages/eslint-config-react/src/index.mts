import baseConfig from '@kurone-kito/eslint-config-base';
import type { TSESLint } from '@typescript-eslint/utils';
// @ts-expect-error
import stylelintConfig from 'eslint-config-stylelint';
import tailwind from 'eslint-plugin-tailwindcss';
import tsEslint from 'typescript-eslint';
import { additionalReactConfig, reactConfig } from './react.mjs';
import { storybookConfig } from './storybook.mjs';
import { compat } from './utils.mjs';

/**
 * The stylelint configuration which is used to remove the
 * `@stylistic` plugin from the configuration.
 *
 * The process suppresses the following error:
 * `Key "plugins": Cannot redefine plugin "@stylistic"`
 */
const exceptedStylelintConfig = (
  stylelintConfig as TSESLint.FlatConfig.ConfigArray
).map<TSESLint.FlatConfig.Config>((cfg) => {
  const { '@stylistic': __, ...restPlugins } = cfg.plugins ?? {};
  return { ...cfg, plugins: { ...restPlugins } };
});

/**
 * The ESLint configuration for the base rules.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/47663}
 */
const config: TSESLint.FlatConfig.ConfigArray = tsEslint.config(
  ...([
    ...reactConfig,
    ...tailwind.configs['flat/recommended'],
    ...exceptedStylelintConfig,
    ...compat.extends('airbnb'),
    ...compat.extends('@kesills/airbnb-typescript'),
    ...baseConfig,
    ...additionalReactConfig,
    ...storybookConfig,
    { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  ] as tsEslint.ConfigWithExtends[]),
);

export default config;
