# `@kurone-kito/eslint-config-base`

My ESLint configuration for general Node.js projects.

## Usage

### Use the flat config (recommended)

First, install this package and its peer dependencies:

```sh
npm install --save-dev @kurone-kito/eslint-config-base eslint typescript
```

Then, create a `eslint.config.mjs` file.
If exists, merge the following configuration into it:

```js
export { default } from '@kurone-kito/eslint-config-base';
```

### for legacy configuration (deprecated)

⚠️ **DEPRECATED**: The legacy configuration is removed.
When you prefer to use the legacy configuration, please use the previous version.

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/eslint-config-base@~0.15.0 \
  @cspell/eslint-plugin \
  eslint \
  eslint-config-airbnb-typescript \
  eslint-import-resolver-node \
  eslint-import-resolver-typescript \
  eslint-plugin-editorconfig \
  eslint-plugin-import \
  eslint-plugin-markdownlint \
  eslint-plugin-n
```

Then, create a `.eslintrc.yml` file.
If exists, merge the following configuration into it:

```yaml
extends:
  - '@kurone-kito/eslint-config-base/.eslintrc.yml'
root: true
```

## License

MIT
