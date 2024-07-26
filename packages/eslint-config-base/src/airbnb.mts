import type { Linter } from 'eslint';
import { compat } from './utils.mjs';

/** The configuration for ESLint to use the Airbnb style guide. */
export const airbnbConfig: readonly Linter.Config[] = [
  ...compat.extends('airbnb-base'),
  // ...compat.extends('airbnb-typescript/base'),
  {
    languageOptions: {
      parserOptions: { project: true, tsconfigRootDir: process.cwd() },
    },
  },
];
