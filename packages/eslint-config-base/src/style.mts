import cspell from '@cspell/eslint-plugin/recommended';
import type { Linter } from 'eslint';
import prettier from 'eslint-config-prettier';
import { compat } from './utils.mjs';

/** Additional configuration for the style language files. */
export const additionalStyleConfig: readonly Linter.Config[] = [
  ...compat.extends('plugin:editorconfig/noconflict'),
  prettier,
  {
    rules: {
      /**
       * Permit explicit statements in Arrow functions, even when the block
       * is optional, with a warning. The default is unconditional allow.
       *
       * The intent is to reduce the amount of code and keep it simple,
       * thereby improving readability.
       */
      'arrow-body-style': 'warn',
    },
  },
];

/** The ESLint configuration for style language files. */
export const styleConfig: readonly Linter.Config[] = [
  { plugins: cspell.plugins ?? {}, rules: cspell.rules ?? {} },
  ...additionalStyleConfig,
];
