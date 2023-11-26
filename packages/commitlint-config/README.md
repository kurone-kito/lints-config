# `@kurone-kito/commitlint-config`

My commitlint configuration for general Node.js projects.

## Usage

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @commitlint/config-conventional \
  @kurone-kito/commitlint-config
```

Then, create a `.commitlintrc.yml` file. If exists, merge the following configuration into it:

```yaml
extends:
  - '@kurone-kito/commitlint-config'
```

## License

MIT
