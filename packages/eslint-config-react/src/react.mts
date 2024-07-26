import type { Linter } from 'eslint';
import { compat } from './utils.mjs';

/** Additional configuration for ESLint to React */
export const additionalReactConfig: readonly Linter.Config[] = [
  {
    rules: {
      /**
       * Allows explicit notation of `true` in JSX notation with a warning.
       * It's unconditionally permitted by default.
       *
       * Because `true` is optional, the intent is to improve readability
       * by reducing the amount of code and keeping it simple.
       */
      'react/jsx-boolean-value': 'warn',
      /**
       * Allows explicit string value notation in JSX notation with a
       * warning. The default is unconditional permission.
       *
       * String values can be described simply as constant attributes
       * intended to reduce code and improve readability.
       */
      'react/jsx-curly-brace-presence': 'warn',
      /**
       * Starting with React 17, the `React` import in JSX/TSX is no longer
       * required, and this rule is no longer necessary.
       *
       * The default is to force it in JSX/TSX.
       * @see {@link https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html}
       */
      'react/react-in-jsx-scope': 'off',
      /**
       * Allows explicit notation of the absence of child elements in JSX
       * notation with a warning. The default is unconditional permission.
       *
       * Self-contained tags are intended to reduce the amount of code,
       * keep things more straightforward, and improve readability.
       */
      'react/self-closing-comp': 'warn',
    },
  },
];

/** Configuration for ESLint to React */
export const reactConfig: readonly Linter.Config[] = [
  ...compat.extends('plugin:react-hooks/recommended'),
  ...additionalReactConfig,
];
