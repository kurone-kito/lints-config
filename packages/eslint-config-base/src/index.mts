import type { TSESLint } from '@typescript-eslint/utils';
import tsEslint from 'typescript-eslint';
import { airbnbConfig } from './airbnb.mjs';
import { dataConfig } from './data.mjs';
import { ignoreConfig } from './ignore.mjs';
import { additionalImportConfig, importConfig } from './import.mjs';
import { additionalJsdocConfig, jsdocConfig } from './jsdoc.mjs';
import { markdownConfig } from './markdown.mjs';
import { additionalNodeConfig, nodeConfig } from './node.mjs';
import { additionalStyleConfig, styleConfig } from './style.mjs';
import { additionalTsConfig, tsConfig } from './ts.mjs';

/**
 * The ESLint configuration for the base rules.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/47663}
 */
const config: TSESLint.FlatConfig.ConfigArray = tsEslint.config(
  ...([
    ...ignoreConfig,
    ...markdownConfig,
    ...dataConfig,
    ...styleConfig,
    ...jsdocConfig,
    ...importConfig,
    ...nodeConfig,
    ...tsConfig,
    ...airbnbConfig,
    ...additionalStyleConfig,
    ...additionalJsdocConfig,
    ...additionalImportConfig,
    ...additionalNodeConfig,
    ...additionalTsConfig,
  ] as tsEslint.ConfigWithExtends[]),
);

export default config;
