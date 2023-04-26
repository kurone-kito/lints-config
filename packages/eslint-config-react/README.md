# `@kurone-kito/eslint-config-react`

My ESLint configuration for React projects.

## Usage

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/eslint-config-react \
  @cspell/eslint-plugin \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint \
  eslint-config-airbnb-typescript \
  eslint-config-prettier \
  eslint-formatter-codeframe \
  eslint-import-resolver-node \
  eslint-import-resolver-typescript \
  eslint-plugin-editorconfig \
  eslint-plugin-import \
  eslint-plugin-jsdoc \
  eslint-plugin-json \
  eslint-plugin-lodash \
  eslint-plugin-markdown \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-storybook \
  eslint-plugin-yaml
```

Then, create a `.eslintrc.yml` file. If exists, merge the following configuration into it:

```yaml
extends:
  - '@kurone-kito/eslint-config-react'
root: true
```

## License

MIT
