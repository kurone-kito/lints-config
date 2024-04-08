# ⚙️ lints-config

<!-- markdownlint-disable MD045 -->

![](logo.png)

<!-- markdownlint-enable MD045 -->

My configuration for the ESLint / Prettier / TypeScript

## Structure of the monorepo

- [`packages/commitlint-config`](packages/commitlint-config/README.md):
  My commitlint configuration for general projects.
- [`packages/cspell-config`](packages/cspell-config/README.md):
  My CSpell configuration for general projects.
- [`packages/eslint-config-base`](packages/eslint-config-base/README.md):
  My ESLint configuration for general projects.
- [`packages/eslint-config-react`](packages/eslint-config-base/README.md):
  My ESLint configuration for React projects.
- [`packages/lint-staged-config`](packages/lint-staged-config/README.md):
  My lint-staged configuration for general projects.
- [`packages/markdownlint-config`](packages/markdownlint-config/README.md):
  My Markdownlint configuration for general projects.
- [`packages/prettier-config`](packages/prettier-config/README.md):
  My Prettier configuration for general projects.
- [`packages/typescript-config`](packages/typescript-config/README.md):
  My TypeScript configuration for general projects.

## System Requirements

- Node.js v18 (LTS Hydrogen) or later

## Initialization

```sh
corepack enable
corepack up
```

## Contributing

Welcome to contribute to this repository! For more details,
please refer to [CONTRIBUTING.md](.github/CONTRIBUTING.md).

Introduce commit message validation at commit time.
“**[Conventional Commits](https://www.conventionalcommits.org/ja/)**”
rule is applied to discourage committing messages that violate conventions.

## LICENSE

MIT
