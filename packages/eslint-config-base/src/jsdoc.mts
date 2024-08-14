import type { Linter } from 'eslint';
import jsdoc from 'eslint-plugin-jsdoc';

/** Additional ESLint configurations for JSDoc comments. */
export const additionalJsdocConfig: readonly Linter.Config[] = [
  {
    rules: {
      /**
       * Allow unconditional type specification of the arguments in JSDoc.
       * The default is a blanket ban.
       *
       * Because in TypeScript projects, it can be inferred from the type
       * definitions in the code.
       *
       * TODO:
       * If there are any inconveniences in document generation, consider
       * removing this rule.
       */
      'jsdoc/require-param-type': 'off',

      /**
       * Allow unconditional type specification of the return value in JSDoc.
       * The default is a blanket ban.
       *
       * Because in TypeScript projects, it can be inferred from the type
       * definitions in the code.
       *
       * TODO:
       * If there are any inconveniences in document generation, consider
       * removing this rule.
       */
      'jsdoc/require-returns-type': 'off',
    },
  },
];

/** The ESLint configurations for JSDoc comments. */
export const jsdocConfig: readonly Linter.Config[] = [
  jsdoc.configs['flat/recommended'],
  ...additionalJsdocConfig,
];
