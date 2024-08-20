# `@kurone-kito/eslint-config-react`

My ESLint configuration for React projects.

## Usage

### Use the flat config (recommended)

First, install this package and its peer dependencies:

```sh
npm install --save-dev @kurone-kito/eslint-config-react eslint
```

Then, create a `eslint.config.mjs` file.
If exists, merge the following configuration into it:

```js
export { default } from '@kurone-kito/eslint-config-react';
```

### for legacy configuration (deprecated)

⚠️ **DEPRECATED**: The legacy configuration is removed.
When you prefer to use the legacy configuration, please use the previous version.

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/eslint-config-react@~0.15.0 \
  @cspell/eslint-plugin \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint \
  eslint-config-airbnb-typescript \
  eslint-formatter-codeframe \
  eslint-import-resolver-node \
  eslint-import-resolver-typescript \
  eslint-plugin-editorconfig \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y \
  eslint-plugin-markdownlint \
  eslint-plugin-n \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-storybook
```

Then, create a `.eslintrc.yml` file.
If exists, merge the following configuration into it:

```yaml
extends:
  - '@kurone-kito/eslint-config-react/.eslintrc.yml'
root: true
```

## License

MIT
