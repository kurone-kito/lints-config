import type { Linter } from 'eslint';
import { compat } from './utils.mjs';

/** Additional configuration for the `import` plugin. */
export const additionalImportConfig: readonly Linter.Config[] = [
  {
    files: ['*.?(c)js?(x)'],
    rules: {
      /**
       * Allow `require` syntax only for JavaScript. By default, it is
       * completely prohibited.
       *
       * There are many situations where pure JavaScript is used outside
       * the scope of transpiling, such as in various configuration files,
       * making the `import` syntax challenging.
       */
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['*.?([cm])js?(x)'],
    rules: {
      /**
       * Allow type inference of return values of exported functions, etc.,
       * only for JavaScript. By default, it is allowed with a warning.
       *
       * There are many situations where CommonJS is used outside the scope
       * of transpiling, such as in various configuration files,
       * where it is challenging to make type definitions mandatory.
       */
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    rules: {
      /**
       * Forces import without extensions for internal modules only.
       * The default is full enforcement.
       *
       * Because it interferes with imports such as `lodash-es`
       * in the ES modules environment.
       */
      'import/extensions': [
        'error',
        'never',
        { js: 'ignorePackages', json: 'ignorePackages' },
      ],
      /**
       * Prohibit dependencies on `devDependencies`, except for specific
       * files. By default, this is a total ban.
       *
       * There is no need for strict separation of dependent packages since
       * they are internally tree shaken by bundlers. Still, some packages
       * are separated into `devDependencies` to make it easier to organize.
       */
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.config.?([cm])[jt]s?(x)',
            '**/*.spec.?([cm])[jt]s?(x)',
            '**/*.test.?([cm])[jt]s?(x)',
          ],
        },
      ],
      /**
       * Allow with a warning that the arbitrary reordering in the
       * import syntax. The default is to allow it unconditionally.
       *
       * in order to deal with the snowballing problem of the import part.
       */
      'import/order': [
        'warn',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'never',
        },
      ],
      /**
       * Allow with a warning that the arbitrary reordering in the
       * import syntax. The default is to allow it unconditionally.
       *
       * To deal with the snowballing problem of the import part.
       */
      'sort-imports': [
        'warn',
        { ignoreCase: true, ignoreDeclarationSort: true },
      ],
    },
  },
];

/** The ESLint configuration for the `import` plugin. */
export const importConfig: readonly Linter.Config[] = [
  ...compat.extends('plugin:import/recommended'),
  ...compat.extends('plugin:import/typescript'),
  ...additionalImportConfig,
];
