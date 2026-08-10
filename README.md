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

## System Requirements

- Node.js: Any of the following versions
  - Jod LTS (`^22.23.1`)
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
