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

⚠️ **DEPRECATED**: The legacy configuration is no longer maintained.

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/eslint-config-base \
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

### ⚠️ Migration warning

Starting with the next version, the default export file will move to the
**Flat Config** format. Therefore, you can still use the existing
configuration by explicitly specifying `.eslintrc.yml` or `.eslintrc.json`
for import. (See the above example)

Also, from 0.16.0 onwards, we'll support only the Flat Config format and
remove the traditional configuration files.

## License

MIT
