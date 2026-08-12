# `@kurone-kito/lint-staged-config`

My lint-staged configuration for any projects

## Features

- Runs [CSpell](https://cspell.org/) then [Biome](https://biomejs.dev/)
  on every staged file before commit.

## Usage

This package only provides the lint-staged configuration; wiring it up
to actually run before a commit (installing a Git hook) is the
consumer's responsibility. The configuration also runs
[Biome](https://biomejs.dev/) on every staged file, so it is required
in practice even though this package marks it as an optional peer
dependency (so installers don't hard-require it). Biome is not
installed automatically, so it is included in the install command
below.

Install this package and its peer dependencies:

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
npx --no -- husky init
printf '#!/bin/sh\nnpx --no -- lint-staged\n' > .husky/pre-commit
chmod +x .husky/pre-commit
```

`--no` stops `npx` from silently downloading and running an unpinned
registry package if `lint-staged` is somehow missing locally, instead
of failing.

`husky init` unconditionally overwrites the `scripts.prepare` entry
(even in a project that has one for something else, like a build step)
and, if Husky is already set up, `.husky/pre-commit` too — check
`package.json` first and merge by hand instead of running it blindly.

## License

MIT
