import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import oxlint from 'eslint-plugin-oxlint';
import globals from 'globals';
import type { ConfigWithExtends } from 'typescript-eslint';
import tsesLint from 'typescript-eslint';

/** Additional ESLint configurations for TypeScript. */
export const additionalTsConfig: readonly Linter.Config[] = [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2025, ...globals.node },
      parserOptions: { ecmaVersion: 'latest', projectService: true },
    },
    linterOptions: { reportUnusedDisableDirectives: 'warn' },
    rules: {
      /**
       * With a warning, allow use standard import syntax to import for
       * type-only. The default is to enable it unconditionally.
       *
       * Tree shaking at build time needs to work correctly to reduce
       * bundle size, and active use of the type import syntax can
       * contribute significantly to this.
       */
      '@typescript-eslint/consistent-type-imports': 'warn',
      /**
       * With a warning, allow type inference for return values of functions
       * and methods referenced from other files, including public methods
       * in exported functions and classes. Default is unconditional allow.
       *
       * Allowing this may cause TypeScript to chain type inference from the
       * wrong type if it does not read the type definition correctly,
       * resulting in type errors in the wrong places.
       */
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
    },
  },
];

/** The ESLint configurations for TypeScript. */
export const tsConfig: readonly ConfigWithExtends[] = [
  eslint.configs.recommended,
  ...tsesLint.configs.recommended,
  ...tsesLint.configs.stylistic,
  oxlint.configs['flat/recommended'] as Pick<Linter.Config, 'rules'>,
  ...additionalTsConfig,
];
