import type { Linter } from 'eslint';

/** The ESLint configuration for Storybook. */
export const storybookConfig: readonly Linter.Config[] = [
  {
    files: ['**/*.stories.?([cm])[jt]s?(x)'],
    rules: {
      /**
       * Unconditionally allow export to `default`.
       *
       * The default is unknown, but since Storybook component definitions
       * are structurally dependent on export to `default`, this permission
       * is explicitly stated to prevent influence by later configuration
       * updates.
       */
      'import/no-anonymous-default-export': 'off',
      /**
       * Allow code that depends on `devDependencies` only for specific
       * packages; otherwise it is prohibited.
       *
       * To organize dependencies, only packages that directly depend on
       * the product code should be listed in the dependencies list, so
       * Storybook component definitions not included in the product code
       * are exceptionally allowed to rely on `devDependencies`.
       */
      'n/no-unpublished-import': [
        'error',
        { allowModules: ['@storybook/testing-library'] },
      ],
    },
  },
];
