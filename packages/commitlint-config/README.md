# `@kurone-kito/commitlint-config`

My commitlint configuration for general Node.js projects.

## Features

- Extends `@commitlint/config-conventional` to validate
  [Conventional Commits](https://www.conventionalcommits.org/) at
  commit time.
- Relaxes `subject-case` and `body-case` to a non-blocking warning, so
  a lowercase-noun-subject commit style (common in Japanese) is not
  rejected outright.

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
