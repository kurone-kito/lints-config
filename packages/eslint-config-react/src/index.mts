import baseConfig from '@kurone-kito/eslint-config-base';
import tsEslint from 'typescript-eslint';
import { additionalReactConfig, reactConfig } from './react.mjs';
import { storybookConfig } from './storybook.mjs';
import { compat } from './utils.mjs';

export default tsEslint.config(
  ...([
    ...reactConfig,
    ...compat.extends('airbnb'),
    ...compat.extends('airbnb-typescript'),
    ...baseConfig,
    ...additionalReactConfig,
    ...storybookConfig,
    { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  ] as tsEslint.ConfigWithExtends[]),
);
