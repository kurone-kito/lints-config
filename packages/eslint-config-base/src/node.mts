import type { Linter } from 'eslint';
import nodePlugin from 'eslint-plugin-n';

/** Additional ESLint configurations for Node.js code. */
export const additionalNodeConfig: readonly Linter.Config[] = [
  {
    rules: {
      /**
       * Unconditional permission to import modules that do not exist.
       * The default is total prohibition.
       *
       * A temporary measure to support the ES module resolution in
       * TypeScript.
       *
       * @see {@link https://github.com/mysticatea/eslint-plugin-node/issues/248#issuecomment-1052550467}
       */
      'n/no-missing-import': 'off',
    },
    settings: { 'import/resolver': { typescript: { alwaysTryTypes: true } } },
  },
  {
    rules: {
      /**
       * Allows the use of unsupported Node.js notation.
       * Unconditional prohibition by default.
       *
       * All Node.js versions prohibit dynamic imports, and the rule is
       * already obsoleted.
       *
       * TODO: Remove this rule in the future.
       */
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },
];

/** The ESLint configuration for Node.js code. */
export const nodeConfig: readonly Linter.Config[] = [
  nodePlugin.configs['flat/recommended-script'],
  ...additionalNodeConfig,
];
