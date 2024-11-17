import baseConfig from '@kurone-kito/eslint-config-base';
import type { TSESLint } from '@typescript-eslint/utils';
import solid from 'eslint-plugin-solid/configs/typescript';
// @ts-expect-error
import stylelintConfig from 'eslint-config-stylelint';
import tailwind from 'eslint-plugin-tailwindcss';
import tsEslint from 'typescript-eslint';
import { storybookConfig } from './storybook.mjs';

/**
 * The ESLint configuration for the base rules.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/47663}
 */
const config: TSESLint.FlatConfig.ConfigArray = tsEslint.config(
  ...([
    ...baseConfig,
    solid,
    ...storybookConfig,
    ...tailwind.configs['flat/recommended'],
    ...stylelintConfig,
    { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  ] as tsEslint.ConfigWithExtends[]),
);

export default config;
