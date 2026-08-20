# ⚙️ lints-config

My configuration for the Biome / CSpell / lint-staged and other tools

## Features

- [Biome](packages/biome-config/README.md): lint and format rules for
  general projects.
- [commitlint](packages/commitlint-config/README.md): Conventional
  Commits validation for general projects.
- [CSpell](packages/cspell-config/README.md): spell-checking
  configuration for general projects.
- [lint-staged](packages/lint-staged-config/README.md): lint-staged
  configuration for general projects.
- [Markdownlint](packages/markdownlint-config/README.md): Markdownlint
  configuration for general projects.

## Structure of the monorepo

- [`packages/biome-config`](packages/biome-config/README.md):
  My Biome configuration for general projects.
- [`packages/commitlint-config`](packages/commitlint-config/README.md):
  My commitlint configuration for general projects.
- [`packages/cspell-config`](packages/cspell-config/README.md):
  My CSpell configuration for general projects.
- [`packages/lint-staged-config`](packages/lint-staged-config/README.md):
  My lint-staged configuration for general projects.
- [`packages/markdownlint-config`](packages/markdownlint-config/README.md):
  My Markdownlint configuration for general projects.

### Moved packages

Build-related packages have been moved to a separate repository and
consolidated:
[`kurone-kito/builder-config`](https://github.com/kurone-kito/builder-config)

- `packages/typescript-config`: My TypeScript configuration for general
  projects.

### Discontinued packages

The following packages were removed in [#134](https://github.com/kurone-kito/lints-config/pull/134),
when this project migrated its own linting and formatting tooling to
Biome. The ESLint-based configurations' build had grown notably
complicated and was dragging down the maintainability of the whole
project, prompting their removal alongside the Biome migration.
`prettier-config` itself caused no particular problems, but it was no
longer in active use and there was no remaining reason to keep it
differentiated from the already-removed ESLint configurations, so it
was dropped in the same release.

They remain published on npmjs.com only for backward compatibility
with existing consumers pinned to an old version; no further updates
will be published.

- [`@kurone-kito/eslint-config-base`](https://www.npmjs.com/package/@kurone-kito/eslint-config-base)
- [`@kurone-kito/eslint-config-react`](https://www.npmjs.com/package/@kurone-kito/eslint-config-react)
- [`@kurone-kito/eslint-config-solid`](https://www.npmjs.com/package/@kurone-kito/eslint-config-solid)
- [`@kurone-kito/prettier-config`](https://www.npmjs.com/package/@kurone-kito/prettier-config)

## System Requirements

- Node.js: Any of the following versions
  - Jod LTS (`^22.23.2`)
  - Krypton LTS (`^24.2.0`)
  - Latest (`>=26.0.0`)

## Development

`pnpm install` builds the workspace automatically, so `pnpm run lint`
and `pnpm test` work immediately afterward.

```sh
pnpm install
pnpm run lint
```

## Contributing

Welcome to contribute to this repository! For more details,
please refer to [CONTRIBUTING.md](.github/CONTRIBUTING.md).

Introduce commit message validation at commit time.
The “**[Conventional Commits](https://www.conventionalcommits.org/ja/)**”
rule is applied to discourage committing messages that violate conventions.

## License

[MIT](./LICENSE)
