# `@kurone-kito/lint-staged-config`

My lint-staged configuration for any projects

## Usage

Install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/lint-staged-config \
  cspell \
  eslint \
  eslint-formatter-codeframe \
  lint-staged \
  prettier
```

Then, create a `.lintstagedrc.mjs` file.
If exists, merge the following configuration into it:

```js
export { default } from '@kurone-kito/lint-staged-config/.lintstagedrc.json' assert { type: 'json' };
```

## License

MIT
