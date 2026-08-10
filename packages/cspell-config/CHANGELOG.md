# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Expand the shared custom word list with new IDD/tooling-related terms
  (`dedup`, `deprioritize`, `desync`, `desynced`, `esync`, `isort`, `onnx`,
  `pylint`, `pyproject`, `pytest`, `qwen`, `toctou`, `undispositioned`,
  `unioned`, `unpushed`, `unreplied`, `unscored`, `unwaived`, `waivable`).
- Expand the package README with a new Features section.

### Changed

- Raise the minimum supported Node.js version to
  `^22.23.1 || ^24.2.0 || >=26.0.0` (was `^20.11 || ^22 || >=24`) — breaking,
  drops Node.js 20 and 25 support.

### Fixed

- Declare the `cspell` peer dependency range explicitly as `>=8.x.x` (was an
  unbounded `*`).

## [0.22.0] - 2026-01-27

### Added

- Add the `sql` and `terraform` built-in CSpell dictionaries.
- Add `solidjs` to the custom dictionary word list.

## [0.20.0] - 2025-07-01

### Changed

- Narrow the supported Node.js range to exclude Node.js 23
  (`^20.11 || ^22 || >=24`).

## [0.18.0] - 2025-05-20

### Changed

- Require Node.js 20.11 or later (drop Node.js 18 support).

## [0.17.2] - 2024-12-14

### Added

- Add `cspell` as an optional peer dependency.
- Add `npmjs` to the custom dictionary word list.

## [0.16.1] - 2024-09-09

### Changed

- Raise the supported Node.js version range to ^18.20 || ^20.10 || >=22
  (required for the import attribute feature).

## [0.13.0] - 2024-07-17

### Added

- Add the `css`, `fsharp`, and `php` dictionaries to the CSpell configuration.

## [0.11.0] - 2024-05-14

### Changed

- Update the custom dictionary word list (adjust `Kuroné` casing, add `kuron`
  and `oxlint`).

## [0.10.0] - 2024-04-13

### Changed

- Add Esperanto (`eo`) to the enabled CSpell dictionary languages.
- Ignore `pnpm-lock.yaml` in addition to `yarn.lock`.

### Removed

- Remove the `aicommits` custom dictionary word.

## [0.9.0] - 2024-03-14

### Added

- Add several CSpell dictionaries (`csharp`, `dotnet`, `eo`, `fonts`, `html`,
  `lorem-ipsum`, `markdown`, `powershell`, `shell`).

## [0.8.1] - 2023-11-12

### Added

- Add more built-in dictionaries (`docker`, `en-gb`, `fullstack`) and
  project-specific words.

### Changed

- Add an explicit `license: MIT` field to the package metadata.

## [0.8.0] - 2023-10-22

### Added

- Add more built-in dictionaries (`bash`, `companies`, `en_US`, `filetypes`,
  `git`, `misc`, `softwareTerms`) for broader word coverage.

## [0.7.6] - 2023-10-05

### Added

- Bundle the package's `LICENSE` file into the published package.
- Add a Yarn PnP note (`usePnP: true`) to the README setup instructions.

### Changed

- Simplify the `import` path to `@kurone-kito/cspell-config` (drop the explicit
  `/cspell.config.json` suffix).
- Ignore `node_modules` and add a regex to ignore scoped package names
  (`@scope/`) in spellcheck ignore patterns.

## [0.7.5] - 2023-09-21

### Added

- Add the `cspell-config` package.
