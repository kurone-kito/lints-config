import type { Linter } from 'eslint';
// @ts-expect-error
import importPlugin from 'eslint-plugin-import';

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
       * Warn when import declarations are arbitrarily reordered.
       * The default configuration allows any ordering.
       *
       * This helps to keep the import section organized and
       * prevents it from becoming cluttered.
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
       * Warn when import declarations are arbitrarily reordered.
       * The default configuration allows any ordering.
       *
       * This also helps organize import statements.
       */
      'sort-imports': [
        'warn',
        { ignoreCase: true, ignoreDeclarationSort: true },
      ],
    },
  },
];

// ! Key "plugins": Cannot redefine plugin "import".
const { rules } = importPlugin.flatConfigs.recommended;

/** The ESLint configuration for the `import` plugin. */
export const importConfig: readonly Linter.Config[] = [
  { rules },
  importPlugin.flatConfigs.typescript,
  ...additionalImportConfig,
];
