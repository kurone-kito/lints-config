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
  eslint-plugin-jsx-a11y \
  eslint-plugin-markdown \
  eslint-plugin-markdownlint \
  eslint-plugin-n \
  eslint-plugin-oxlint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-storybook \
  eslint-plugin-yaml
```

Then, create a `.eslintrc.yml` file.
If exists, merge the following configuration into it:

```yaml
extends:
  - '@kurone-kito/eslint-config-react/.eslintrc.yml'
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
