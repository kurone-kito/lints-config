# Guidelines for AI Agents

This project is a common configuration repository for linting tools.

- Please write comments in English.
- Use the `pnpm run lint:fix` command to ensure code style quality.
- If you have further considerations, uncertainties, or better suggestions,
  please point them out, even if they seem minor. When doing so, provide at
  least one recommended solution. If in Plan mode, please resolve all these
  points before starting implementation.

## Packages

| path                           | package name                       | description                                         |
| ------------------------------ | ---------------------------------- | --------------------------------------------------- |
| `/`                            | `@kurone-kito/lints-config`        | Manage the monorepo workspace and linting.          |
| `packages/biome-config`        | `@kurone-kito/biome-config`        | My Biome configuration for general projects.        |
| `packages/commitlint-config`   | `@kurone-kito/commitlint-config`   | My commitlint configuration for general projects.   |
| `packages/cspell-config`       | `@kurone-kito/cspell-config`       | My CSpell configuration for general projects.       |
| `packages/lint-staged-config`  | `@kurone-kito/lint-staged-config`  | My lint-staged configuration for general projects.  |
| `packages/markdownlint-config` | `@kurone-kito/markdownlint-config` | My Markdownlint configuration for general projects. |

## Development

### Install the dependencies

```sh
corepack enable
pnpm install
```

### Building

```sh
pnpm run build

# to build a specific package
pnpm -F '@kurone-kito/biome-config' run build
```

### Linting

```sh
pnpm run lint
pnpm run lint:fix # Lint and auto-fix
```

### Cleaning

```sh
pnpm run clean
```
