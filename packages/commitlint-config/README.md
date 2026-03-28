# `@kurone-kito/commitlint-config`

![NPM Version](https://img.shields.io/npm/v/%40kurone-kito%2Fcommitlint-config)
![Node Current](https://img.shields.io/node/v/%40kurone-kito%2Fcommitlint-config)
![NPM Last Update](https://img.shields.io/npm/last-update/%40kurone-kito%2Fcommitlint-config)
![NPM Downloads](https://img.shields.io/npm/dy/%40kurone-kito%2Fcommitlint-config)
![npms.io](https://img.shields.io/npms-io/final-score/%40kurone-kito/commitlint-config)

My commitlint configuration for general Node.js projects.

## Usage

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @commitlint/config-conventional \
  @kurone-kito/commitlint-config
```

Then, create a `.commitlintrc.yml` file.
If exists, merge the following configuration into it:

```yaml
extends:
  - '@kurone-kito/commitlint-config'
```

## License

MIT
