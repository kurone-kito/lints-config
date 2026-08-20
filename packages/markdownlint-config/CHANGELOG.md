# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.23.0] - 2026-08-21

### Added

- Expand the package README with a new Features section.

### Changed

- Raise the minimum supported Node.js version to
  `^22.23.2 || ^24.2.0 || >=26.0.0` (was `^20.11 || ^22 || >=24`) — breaking,
  drops Node.js 20 and 25 support.
- Tighten `no-duplicate-heading` from unconditionally allowing all duplicate
  headings to `siblings_only: true`, restoring duplicate-heading detection
  within the same parent section — the upstream `markdownlint-cli2` bug that
  `siblings_only` previously worked around is now fixed.

### Fixed

- Declare an optional peer dependency on `markdownlint-cli2 >=0.23.x` in the
  published manifest (previously undeclared).

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

## [0.14.0] - 2024-08-04

### Changed

- Disable the line-length rule for headings.

## [0.10.0] - 2024-04-13

### Fixed

- Fix the `build:license` script copying the `LICENSE` file into the wrong
  package directory.

## [0.9.0] - 2024-03-14

### Added

- Add the `markdownlint-config` package.
