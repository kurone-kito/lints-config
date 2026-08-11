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

This package only provides the commitlint configuration; wiring it up
to actually validate commit messages (installing `@commitlint/cli` and
running it from a Git hook) is the consumer's responsibility.

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @commitlint/config-conventional \
  @kurone-kito/commitlint-config
```

Then, create a `.commitlintrc.yml` file.
If it already exists, merge the following configuration into it:

```yaml
extends:
  - '@kurone-kito/commitlint-config'
```

To validate commit messages at commit time, also install
[`@commitlint/cli`](https://www.npmjs.com/package/@commitlint/cli) and
a Git hook manager such as [Husky](https://typicode.github.io/husky/),
then run `commitlint --edit` from a `commit-msg` hook. For example:

```sh
npm install --save-dev @commitlint/cli husky
npx husky init
rm .husky/pre-commit
printf '#!/bin/sh\nnpx commitlint --edit "${1}"\n' > .husky/commit-msg
```

`husky init` also creates a sample `.husky/pre-commit` hook that runs
`npm test`; the example above removes it, since this setup only wires
up commit-message validation. Keep it (or replace its content) if the
project also wants a pre-commit hook.

## License

MIT
