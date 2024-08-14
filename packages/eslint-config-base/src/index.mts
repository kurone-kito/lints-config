import tsEslint from 'typescript-eslint';
import { airbnbConfig } from './airbnb.mjs';
import { dataConfig } from './data.mjs';
import { ignoreConfig } from './ignore.mjs';
import { importConfig, additionalImportConfig } from './import.mjs';
import { jsdocConfig, additionalJsdocConfig } from './jsdoc.mjs';
import { markdownConfig } from './markdown.mjs';
import { additionalNodeConfig, nodeConfig } from './node.mjs';
import { additionalStyleConfig, styleConfig } from './style.mjs';
import { additionalTsConfig, tsConfig } from './ts.mjs';

export default tsEslint.config(
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
