# `@kurone-kito/lint-staged-config`

My lint-staged configuration for any projects

## Features

- Runs [CSpell](https://cspell.org/) then [Biome](https://biomejs.dev/)
  on every staged file before commit.

## Usage

This package only provides the lint-staged configuration; wiring it up
to actually run before a commit (installing a Git hook) is the
consumer's responsibility. The configuration also runs
[Biome](https://biomejs.dev/), which is not one of the packages
installed below and must be added separately.

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
`lint-staged` from a `pre-commit` hook. For example:

```sh
npm install --save-dev husky
npx husky init
echo 'npx lint-staged' > .husky/pre-commit
```

## License

MIT
