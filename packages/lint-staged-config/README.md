# `@kurone-kito/lint-staged-config`

My lint-staged configuration for any projects

## Features

- Runs [CSpell](https://cspell.org/) then [Biome](https://biomejs.dev/)
  on every staged file before commit.

## Usage

This package only provides the lint-staged configuration; wiring it up
to actually run before a commit (installing a Git hook) is the
consumer's responsibility. The configuration also runs
[Biome](https://biomejs.dev/), which this package does not declare as
a dependency, so it is included in the install command below.

Install this package, its peer dependencies, and Biome:

```sh
npm install --save-dev \
  @biomejs/biome \
  @kurone-kito/lint-staged-config \
  cspell \
  lint-staged
```

Then, create a `.lintstagedrc.mjs` file.
If it already exists, merge the following configuration into it:

```js
export { default } from '@kurone-kito/lint-staged-config';
```

To run it automatically before a commit, also install a Git hook
manager such as [Husky](https://typicode.github.io/husky/), then run
`lint-staged` from a `pre-commit` hook. For a project with no Husky
setup yet:

```sh
npm install --save-dev husky
npx husky init
printf '#!/bin/sh\nnpx lint-staged\n' > .husky/pre-commit
```

If Husky is already set up, `husky init` overwrites the `prepare`
script and `.husky/pre-commit` — skip it and just add or merge the
`pre-commit` hook by hand instead.

## License

MIT
