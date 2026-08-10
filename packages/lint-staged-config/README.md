# `@kurone-kito/lint-staged-config`

My lint-staged configuration for any projects

## Features

- Runs [CSpell](https://cspell.org/) then [Biome](https://biomejs.dev/)
  on every staged file before commit.

## Usage

Install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/lint-staged-config \
  cspell \
  lint-staged
```

Then, create a `.lintstagedrc.mjs` file.
If it already exists, merge the following configuration into it:

```js
export { default } from '@kurone-kito/lint-staged-config';
```

## License

MIT
