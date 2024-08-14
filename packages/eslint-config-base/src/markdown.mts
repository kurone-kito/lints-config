import type { Linter } from 'eslint';
import markdown from 'eslint-plugin-markdown';
import { compat } from './utils.mjs';

/** The ESLint configuration for Markdown files. */
export const markdownConfig: readonly Linter.Config[] = [
  ...(markdown.configs.recommended as Linter.Config[]),
  ...compat.config({
    overrides: [
      {
        extends: ['plugin:markdownlint/recommended'],
        files: ['*.md'],
        parser: 'eslint-plugin-markdownlint/parser',
      },
    ],
  }),
];
