# `@kurone-kito/lint-staged-config`

![NPM Version](https://img.shields.io/npm/v/%40kurone-kito%2Flint-staged-config)
![Node Current](https://img.shields.io/node/v/%40kurone-kito%2Flint-staged-config)
![NPM Last Update](https://img.shields.io/npm/last-update/%40kurone-kito%2Flint-staged-config)
![NPM Downloads](https://img.shields.io/npm/dy/%40kurone-kito%2Flint-staged-config)
![npms.io](https://img.shields.io/npms-io/final-score/%40kurone-kito/lint-staged-config)

My lint-staged configuration for any projects

## Usage

Install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/lint-staged-config \
  cspell \
  lint-staged
```

Then, create a `.lintstagedrc.mjs` file.
If exists, merge the following configuration into it:

```js
export { default } from '@kurone-kito/lint-staged-config';
```

## License

MIT
