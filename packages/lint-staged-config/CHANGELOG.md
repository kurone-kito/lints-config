# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.23.0] - 2026-08-21

### Added

- Export the `LintStagedConfig` type from the package's public API.
- Expand the package README with a new Features section, and document how to
  wire lint-staged into a pre-commit hook (installing Husky,
  `npx --no -- lint-staged`) since this package only provides the
  configuration — also noting that Biome must be installed explicitly
  despite being an optional peer dependency.

### Changed

- Raise the minimum supported Node.js version to
  `^22.23.2 || ^24.2.0 || >=26.0.0` (was `^20.11 || ^22 || >=24`) — breaking,
  drops Node.js 20 and 25 support.
- Update package keywords to reflect the tools actually invoked by the config
  (drop stale `eslint`/`prettier` entries, add `biome`).
- Declare an optional `@biomejs/biome` peer dependency (`>=2.3.9`), and raise
  the `cspell` peer dependency floor from `>=5.7.x` to `>=8.x.x`.

### Fixed

- Add a proper `exports` map (with `types`/`default` conditions) and a top-level
  `types` field so the package's TypeScript declarations resolve correctly for
  consumers.

## [0.21.0] - 2025-10-03

### Changed

- Make `useBiome` the default and only export.

### Removed

- Remove the `useEslint` preset (ESLint/oxlint/Prettier-based).

## [0.20.0] - 2025-07-01

### Changed

- Narrow the supported Node.js range to exclude Node.js 23
  (`^20.11 || ^22 || >=24`).

## [0.18.0] - 2025-05-20

### Added

- Add a `useBiome` preset that runs cspell and Biome instead of
  ESLint/oxlint/Prettier.

### Changed

- Rewrite the package as a TypeScript module exporting `useEslint` (default) and
  `useBiome` presets instead of a static YAML/JSON config.
- Require Node.js `^20.11 || >=22` (was `^18.20 || ^20.10 || >=22`) — drops
  Node.js 18 support.

### Removed

- Remove `eslint`, `eslint-formatter-codeframe`, and `prettier` from the peer
  dependencies.

## [0.17.2] - 2024-12-14

### Changed

- Require ESLint 9 or later as a peer dependency (previously ESLint 8).
- Mark all peer dependencies (`cspell`, `eslint`, `eslint-formatter-codeframe`,
  `lint-staged`, `prettier`) as optional.

## [0.16.1] - 2024-09-09

### Changed

- Raise the supported Node.js version range to ^18.20 || ^20.10 || >=22
  (required for the import attribute feature).

## [0.13.0] - 2024-07-17

### Added

- Add oxlint as a linting step in the lint-staged configuration.

### Changed

- Enable ESLint auto-fix (--fix) in the lint-staged configuration.

## [0.10.0] - 2024-04-13

### Fixed

- Fix the `build:license` script copying the `LICENSE` file into the wrong
  package directory.

## [0.9.0] - 2024-03-14

### Changed

- Set an explicit ESLint cache location (`node_modules/.cache/eslint/`) in the
  lint-staged command.

## [0.8.3] - 2023-12-05

### Fixed

- Run the lint-staged commands directly instead of through `yarn exec`, so they
  work regardless of the package manager.

## [0.8.1] - 2023-11-12

### Added

- Add the `lint-staged-config` package.
