import type { Linter } from 'eslint';

/** The configuration for ESLint to Storybook */
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
       * Exporting code that depends `on devDependencies is` allowed only
       * for specific packages on an exception basis, and it is prohibited
       * by default.
       *
       * To organize dependencies, only packages that directly depend on
       * the product code should be listed in the dependencies list, so
       * Storybook component definitions not included in the product code
       * are exceptionally allowed to rely on `devDependencies`.
       */
      'n/no-unpublished-import': [
        'error',
        { allow: ['@storybook/react', '@storybook/testing-library'] },
      ],
    },
  },
];
