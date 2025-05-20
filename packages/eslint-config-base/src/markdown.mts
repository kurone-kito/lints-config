import markdown from '@eslint/markdown';
import type { Linter } from 'eslint';
import { compat } from './utils.mjs';

/** The ESLint configuration for Markdown files. */
export const markdownConfig: readonly Linter.Config[] = [
  ...markdown.configs.recommended,
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
