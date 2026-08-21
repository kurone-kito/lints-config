# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.23.0] - 2026-08-21

### Added

- Expand the package README with new Features and Usage sections, and
  document the `./biome.yml` export as source-only (a YAML source compiled
  to `biome.json` at publish time; do not point `extends` at it directly).

### Changed

- Raise the minimum supported Node.js version to
  `^22.23.2 || ^24.2.0 || >=26.0.0` (was `^20.11 || ^22 || >=24`) — breaking,
  drops Node.js 20 and 25 support.
- Remove the `suspicious.noUnknownAtRules: 'off'` override that had been a
  Tailwind CSS v4+ workaround, since it is no longer needed with the current
  Biome version — at-rule linting is re-enabled by default.
- Raise the `@biomejs/biome` peer dependency floor from `>=2.3.x` to
  `>=2.3.9`.

### Fixed

- Bump the pinned `$schema` in `biome.yml` from Biome 2.3.12 to 2.5.6 to match
  the installed Biome version.
- Add `!**/biome.jsonc` to the ignore-list glob, closing a gap where the
  config's own compiled output could be linted.

## [0.22.0] - 2026-01-27

### Added

- Enable Biome's Tailwind CSS directive parsing
  (`css.parser.tailwindDirectives`) in the shared config.

### Changed

- Bump the recommended `@biomejs/biome` peer dependency range to `>=2.3.x` (from
  `>=2.x.x`).

## [0.21.0] - 2025-10-03

### Changed

- Migrate the configuration schema to Biome v2 (schema `2.2.5`), replacing the
  deprecated `organizeImports` block with
  `assist.actions.source.organizeImports` and switching `files.ignore` to
  `files.includes` negation patterns.
- Require `@biomejs/biome` v2 or later as a peer dependency (previously any
  version).
- Disable the `suspicious.noUnknownAtRules` lint rule as a temporary workaround
  for Tailwind CSS v4+ at-rules.

## [0.20.0] - 2025-07-01

### Changed

- Narrow the supported Node.js range to exclude Node.js 23
  (`^20.11 || ^22 || >=24`).

## [0.19.0] - 2025-06-09

### Changed

- Disable the `useLiteralKeys` lint rule for TS4111 compatibility.

## [0.18.0] - 2025-05-20

### Added

- Add the `biome-config` package.
