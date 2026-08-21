# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.23.0] - 2026-08-21

### Added

- Expand the package README with a new Features section documenting the
  `subject-case`/`body-case` relaxation.
- Document how to wire the CLI and a Git hook (`commitlint --edit` via a
  `commit-msg` hook, installing `@commitlint/cli` and Husky) in the README,
  since this package only provides the configuration.

### Changed

- Raise the minimum supported Node.js version to
  `^22.23.2 || ^24.2.0 || >=26.0.0` (was `^20.11 || ^22 || >=24`) — breaking,
  drops Node.js 20 and 25 support.

## [0.20.0] - 2025-07-01

### Changed

- Narrow the supported Node.js range to exclude Node.js 23
  (`^20.11 || ^22 || >=24`).

## [0.18.0] - 2025-05-20

### Changed

- Require Node.js `^20.11 || >=22` (was `^18.20 || ^20.10 || >=22`) — drops
  Node.js 18 support.

## [0.16.1] - 2024-09-09

### Changed

- Raise the supported Node.js version range to ^18.20 || ^20.10 || >=22
  (required for the import attribute feature).

## [0.10.0] - 2024-04-13

### Fixed

- Add a `commitlint.config.mjs` entry point and make it the package's default
  export, working around a commitlint ESM config-loading issue
  (commitlint/commitlint#3970).
- Fix the `build:license` script copying the `LICENSE` file into the wrong
  package directory.

## [0.8.2] - 2023-12-03

### Added

- Add the `commitlint-config` package.
