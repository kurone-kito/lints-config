# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.23.0] - 2026-08-21

### Added

- Import the IDD (Issue-Driven Development) framework end-to-end: worktree-guard
  git hooks, `.github/idd/config.json`, the `idd-*` instruction files (and their
  `lite/` variants) under `.github/instructions/`, onboarding/policy docs under
  `docs/`, the Claude Code agent surface (`.claude/settings.json`, the
  `issue-authoring` skill), and AI-agent entry files (`AGENTS.md`, `CLAUDE.md`,
  `GEMINI.md`, an expanded `.github/copilot-instructions.md`) that reference the
  IDD workflow.
- Add supporting repo scaffolding re-imported from the upstream template:
  GitHub issue templates, `.github/funding.yml`, `.gitmessage`,
  `docs/ai-strategy.md`, and `docs/permissions.md`.
- Add five new IDD-related GitHub Actions workflows: `idd-drift-check.yml`
  (detects upstream IDD template drift), `idd-advisory-convergence.yml`
  (exempting bot-authored PRs), `post-merge-cleanup.yml`,
  `strip-untrusted-labels.yml` (strips reserved IDD labels applied by the
  semantic auto-labeler), and `idd-doctor.yml` (runs as a pull-request health
  gate).
- Add a weekly `verify-peer-floors.yml` CI job that verifies every package's
  declared `peerDependency` floors are still satisfiable.
- Create the IDD coordination GitHub labels and verify the IDD onboarding flow.
- Wire dozens of `idd:*` npm scripts (claim locking, discovery, CI-wait,
  merge-execute, roadmap-audit, etc.) to a pinned `@kurone-kito/idd-skill`
  helper runtime dependency, and re-import the `issue-authoring` companion skill
  content from upstream v0.6.0.
- Add `docs/release-process.md` documenting the release process and CHANGELOG
  update step, cross-referenced from `.github/copilot-instructions.md`,
  `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`.
- Add contract/integration tests that verify packed artifacts and generated
  configs (`test/exports-resolution.test.mjs`,
  `test/lint-staged-shape.test.mjs`, `test/pack-contents.test.mjs`,
  `test/tool-integration.test.mjs`, `test/helpers.mjs`).
- Add `scripts/check-biome-schema-pins.mjs` to keep Biome `$schema` pins in sync
  with the installed Biome version.
- Add a Features section to the root `README.md` linking to each package's
  README, and a "Discontinued packages" section documenting the four packages
  removed in [#134](https://github.com/kurone-kito/lints-config/pull/134)
  (`eslint-config-base`, `eslint-config-react`, `eslint-config-solid`,
  `prettier-config`) that remain published on npm only for backward
  compatibility.
- Add `CHANGELOG.md` files for the root and each of the five published
  packages, backfilling prior release history.
- Add prerelease publishing support: `release.yml` accepts a manual
  `workflow_dispatch` trigger that publishes an alpha/prerelease build under
  the npm `next` dist-tag without creating a git tag or GitHub Release
  (originally a separate `release-next.yml` workflow, later consolidated into
  `release.yml`).

### Changed

- Re-import the runtime baseline from `pnpm-project-template`: raise the minimum
  supported Node.js version (root and all five published packages) from
  `^20.11 || ^22 || >=24` to `^22.23.2 || ^24.2.0 || >=26.0.0` — breaking, drops
  Node.js 20 and 25 support, and later raised further within the `22.x` line to
  pick up a 2026-07-29 Node.js emergency security release fixing multiple CVEs
  (including CVE-2026-56846, CVE-2026-56848, and CVE-2026-58043); bump the
  pinned `packageManager` from pnpm 10.28.2 to 11.22.0, and remove the
  standalone `.npmrc` in favor of `pnpm-workspace.yaml` settings.
- Bridge the upstream v0.6.0 doc-lint configs onto this repository's own: rename
  `cspell.config.yml` to `.cspell.config.yml`, extend `.markdownlint.yml`, and
  update `.vscode/settings.json`.
- Reconcile existing shared meta config files with the upstream template:
  disable CodeRabbit issue-enrichment auto-labeling (`.coderabbit.yaml`),
  vendor `pnpm-lock.yaml` and enforce LF line endings (`.gitattributes`), and
  group Dependabot minor/patch updates (`.github/dependabot.yml`).
- Record and expand the v0.6.0 IDD policy decisions in `docs/idd-policy.md`,
  re-import the IDD instruction files under `.github/instructions/` from
  upstream v0.6.0, and re-sync `docs/customization.md` and the
  `docs/onboarding/` docs with the upstream template.
- Update development dependencies (TypeScript, Biome, cspell,
  `@cspell/cspell-types`, markdownlint-cli2, lint-staged, js-yaml,
  `@commitlint/config-conventional`, cpy-cli, rimraf) and pin GitHub Actions
  versions (`actions/checkout`, `actions/setup-node`, `actions/stale`,
  `pnpm/action-setup`, `release-drafter/release-drafter`) via Dependabot as
  routine maintenance.
- Trust source-pinned required checks (`ciGate.trustSourcePinnedRequiredChecks`)
  and empty branch-protection reads (`ciGate.trustEmptyProtectionReads`) in the
  IDD CI gate, to stop false CI-gate blockers on every PR.
- Re-sync the IDD workflow, instruction/docs surface, issue-authoring contract,
  and pinned helper runtime to upstream v0.7.0, and record the v0.7.0 IDD
  policy decisions in `docs/idd-policy.md`.
- Harden `docs/release-process.md` against merge-window and rename edge cases,
  document the follow-up procedure when the release publish-time gate finds a
  discrepancy, and record the release-draft merge-vs-relabel race as a known
  limitation.

### Fixed

- Repair the release workflow so releases stop failing (`common-release.yml`,
  `release.yml`).
- Align `release-drafter.yml`'s categorization with the repository's actual
  labels, then make the categories actually engage by adding the missing
  autolabeler config.
- Fix the build workflow so it triggers on slash-namespaced branches
  (`push-feature.yml`).
- Exempt IDD coordination labels from StaleBot auto-staling (`stale.yml`).
- `pnpm install` now builds the workspace automatically (via the `prepare`
  script), so `pnpm test`/`pnpm run lint` work on a fresh clone without a manual
  build step first.
- Restore literal `{{...}}` placeholder tokens in onboarding meta-docs that had
  been accidentally substituted with real values.
- Restrict the `update_release_draft` CI job to `push` events — it previously
  also ran as a no-op dry-run on `pull_request`, which could starve real
  updates.
- Label fork-originated pull requests via `pull_request_target` so they
  receive the same automated category labels as same-repo PRs.

### Security

- Pin third-party GitHub Actions to commit SHAs across CI workflows
  (`common-release.yml`, `push-feature.yml`, `push-main.yml`, `stale.yml`) to
  reduce supply-chain risk from mutable version tags.
- Adopt npm trusted publishing (OIDC, `id-token: write`) for the release
  workflows and remove the long-lived `NPM_TOKEN` secret now that it is no
  longer needed.
- Route vulnerability reports through GitHub private security advisories
  instead of public issues or pull requests.

## [0.22.0] - 2026-01-27

### Added

- Add `.github/copilot-instructions.md`, the canonical Copilot-first project
  guidance document, and further customize it in a follow-up commit.

### Changed

- Bump the root Biome dependency and schema reference to `2.3.13`.
- Replace the local `scripts/isPrerelease.mjs` with the published
  `@kurone-kito/is-prerelease` package for prerelease-version checks in CI.

### Removed

- Remove the project logo from the README.

## [0.21.0] - 2025-10-03

### Added

- Add a release-workflow check that verifies the version number and determines
  prerelease/release status before publishing.

### Changed

- Rename `biome.json` to `biome.jsonc` and migrate the root Biome configuration
  to Biome v2.
- Modernize the CI workflows (switch to `pnpm/action-setup`, update GitHub
  Actions to v5, simplify the Node.js/corepack setup, and run lint instead of
  tests on feature branches).

### Removed

- Remove the ESLint and oxlint tooling and their associated shared config
  packages from the repository (Biome is now the sole linter/formatter).
- Remove the Prettier-based shared config package and all Prettier references
  from the root tooling.

## [0.20.0] - 2025-07-01

### Added

- Attach packaged release archives (`.tgz`) as GitHub Release assets.

### Changed

- Document in the README that several build-related shared config packages have
  moved to a separate repository.
- Remove Node.js 23 from the CI test matrix (CI now covers Node.js 20, 22, and
  24).

## [0.19.0] - 2025-06-09

### Added

- Add a `SECURITY.md` policy and a Stale-issue workflow (synced from the
  upstream project template).

### Changed

- Refactor the release CI into a shared reusable workflow (`common-release.yml`)
  and add a pre-release (`release-next`) workflow.
- Remove the `reviewers`/`assignees` fields from `.github/dependabot.yml`.

## [0.18.0] - 2025-05-20

### Added

- Add Node.js 24 support to CI.

### Changed

- Switch the repository's own linting/formatting tooling from ESLint and
  Prettier to Biome.
- Require Node.js `^20.11 || >=22` (was `^18.20 || ^20.10 || >=22`) — drops
  Node.js 18 support.

### Fixed

- Fix several release-workflow issues (corepack installation, npm registry token
  setup, and an explicit build step before publishing).

## [0.17.3] - 2024-12-15

### Fixed

- Fix the release workflow so publishing no longer fails on the version-bump
  commit (`pnpm run publish --no-git-check`).

## [0.17.2] - 2024-12-14

### Added

- Add Node.js 23 to the CI test matrix.

### Changed

- Migrate the workspace tooling from Yarn to pnpm.

## [0.16.1] - 2024-09-09

### Changed

- Raise the supported Node.js version range to ^18.20 || ^20.10 || >=22
  (required for the import attribute feature).
- Update the Yarn package manager version.
- Update dependencies across the monorepo.

## [0.16.0] - 2024-08-21

### Changed

- Update dependencies across the monorepo.

## [0.15.0] - 2024-08-17

### Changed

- Migrate the repository's own ESLint configuration to flat config
  (eslint.config.mjs).
- Update the Yarn package manager version.
- Update dependencies across the monorepo.

## [0.14.0] - 2024-08-04

### Changed

- Bump the specified Node.js version.
- Change the monorepo build script to run workspace builds topologically.
- Improve the .gitattributes export-ignore rules.
- Improve the Markdownlint CLI ignore pattern for node_modules.
- Update dependencies across the monorepo.

## [0.13.0] - 2024-07-17

### Changed

- Increase the specified Node.js version (18.20.3 to 18.20.4).
- Update the Yarn package manager version.
- Refactor the npm-scripts across the workspace packages.
- Improve the VS Code workspace configuration.
- Improve the pre-commit hook to auto-build via Corepack instead of failing
  outright.
- Update dependencies across the monorepo (some peer dependency ranges bumped).

## [0.12.0] - 2024-06-19

### Added

- Add npm-scripts to support the pre-release workflow.

### Changed

- Update dependencies across the monorepo.
- Update the Yarn package manager version.

### Removed

- Remove Node.js v21 from the CI test matrix.

## [0.11.1] - 2024-06-08

### Changed

- Mark `.imgbotconfig` as `export-ignore` in `.gitattributes`.
- Update the required Node.js version to 18.20.3.

## [0.11.0] - 2024-05-14

### Added

- Add an ImgBot configuration (`.imgbotconfig`) for automatic image compression,
  plus a matching VS Code file association.
- Add oxlint as an additional linter, with `lint:oxlint:check` /
  `lint:oxlint:fix` scripts.
- Add Node.js 22.x to the CI test matrix.

### Changed

- Update the required Node.js version to 18.20.2.
- Update the Yarn version to 4.2.2 (with an integrity checksum).

### Fixed

- Fix a broken Code of Conduct link in the Chinese contributing guide
  (`CONTRIBUTING.zh.md`).

## [0.10.0] - 2024-04-13

### Added

- Enable Dependabot updates for GitHub Actions.
- Add a YAML schema mapping for `.coderabbit.yaml` in VS Code settings.

### Changed

- Restructure `CONTRIBUTING.md` (and its translations) into a numbered guide
  with more detail on the pull-request/release workflow.
- Update the Code of Conduct (and its translations) to the latest Contributor
  Covenant wording.
- Simplify the README initialization instructions to use `corepack up` and add a
  Contributing section linking to `CONTRIBUTING.md`.
- Update the required Node.js version to 18.20.1.
- Upgrade Husky to v9.
- Set an explicit ESLint cache location (`node_modules/.cache/eslint/`) for the
  root lint scripts.
- Pin the Yarn package manager version with an integrity checksum.

### Fixed

- Update the JSON import assertion syntax (`assert` to `with`) in
  `.lintstagedrc.mjs` for compatibility with newer Node.js versions.

### Removed

- Remove the unused root `start` script.

## [0.9.0] - 2024-03-14

### Added

- Add CodeRabbit AI code review configuration (`.coderabbit.yaml`).
- Document Node.js version requirements and workspace initialization steps in
  the README.

### Changed

- Clean up repository tooling configuration (`.gitattributes`,
  `.prettierignore`, VS Code settings).
- Simplify Husky git hook scripts by removing the legacy `husky.sh` sourcing
  line.
- Add `export-ignore` git attributes for repo-internal files (`.github/`,
  `.husky/`, `reviewpad.yml`) so they're excluded from published archives.
- Update the required Node.js (18.19.1) and Yarn (4.1.1) versions.
- Update the `release-drafter` GitHub Action to v6.
- Enable Markdownlint for the repository's own Markdown files, extending the new
  `markdownlint-config` package.

### Fixed

- Remove trailing commas from `tsconfig.json` for stricter JSON compatibility.

### Removed

- Remove the Reviewpad CI integration (`reviewpad.yml`) and its VS Code schema
  reference.

## [0.8.4] - 2023-12-06

## [0.8.3] - 2023-12-05

### Changed

- Rename the duplicate `Prepare the Node.js environment` steps in the
  `push-feature` and `release` workflows to `Pre-prepare`/`Post-prepare` for
  clarity.

## [0.8.2] - 2023-12-03

### Added

- Document the new `commitlint-config` package in the root README.

### Changed

- Switch the root `.commitlintrc.yml` to extend the new
  `@kurone-kito/commitlint-config` package instead of
  `@commitlint/config-conventional` directly.
- Reorder the Node.js setup step in CI workflows so corepack is enabled before
  the Yarn cache is restored.
- Bump the pinned Node.js version to 18.19.0.

## [0.8.1] - 2023-11-12

### Added

- Add a root `.lintstagedrc.mjs` that re-exports the new
  `@kurone-kito/lint-staged-config` package.
- Document the new `lint-staged-config` package in the README.

### Changed

- Upgrade the Yarn toolchain to Yarn Berry v4.0.1, removing plugins now bundled
  with Yarn 4 (`constraints`, `engines`, `interactive-tools`, `typescript`,
  `version`, `workspace-tools`) and the `constraints.pro` file.
- Bump `actions/checkout` and `actions/setup-node` GitHub Actions to v4.
- Update editor/lint tooling for the Yarn 4 upgrade (VS Code Prettier SDK path,
  `.eslintignore`, and `tsconfig.json` `include`) to account for the new SDK
  layout and `.lintstagedrc.mjs`.

## [0.8.0] - 2023-10-22

### Added

- Add Node.js 21.x to the CI test matrix.

### Changed

- Bump the pinned Node.js version to 18.18.2.

## [0.7.6] - 2023-10-05

### Changed

- Simplify the root CSpell configuration to import `@kurone-kito/cspell-config`
  directly (drop the `/cspell.config.json` suffix).
- Bump the pinned Node.js version to 18.18.0.
- Ignore generated per-package `LICENSE` files in `.gitignore`.

## [0.7.5] - 2023-09-21

### Added

- Add an `aicommits`-based `commit` script for generating Conventional Commits
  messages.
- Document the new `cspell-config` package in the root README.

### Changed

- Raise the minimum supported Node.js version to 18 (drop Node 16 from the CI
  matrix and update `.node-version`/`.nvmrc`/`.tool-versions`/`engines.node`).
- Switch the root CSpell configuration to extend the new
  `@kurone-kito/cspell-config` package instead of inline settings.

## [0.7.4] - 2023-08-26

### Changed

- Update the Yarn toolchain to v3.6.3 and reorganize `.prettierignore`, along
  with routine devDependency bumps.

## [0.7.3] - 2023-08-11

### Changed

- Bump the pinned Node.js version to 16.20.2.

## [0.7.2] - 2023-07-28

### Changed

- Remove macOS from the CI test matrix.

## [0.7.1] - 2023-07-27

### Added

- Add automatic release-draft generation via Release Drafter, keeping a draft
  GitHub Release up to date from merged pull requests.
- Add a recommended VSCode extension for YAML editing support.

### Changed

- Upgrade core tooling to Prettier v3 (dropping incompatible plugins and
  updating the CLI invocation and ignore file accordingly), replace pretty-quick
  with lint-staged for pre-commit formatting, and upgrade typescript-eslint to
  v6.
- Update the pinned Yarn release to 3.6.1.
- Refine the CSpell configuration (enable dot-file globbing, adjust ignored
  paths, and add a dictionary word).
- Change the package-publish workflow to trigger on GitHub Release publication
  instead of pushes to main.
- Expand CI testing to run across multiple OS platforms (Ubuntu, macOS, and
  Windows with both bash and PowerShell), drop Node.js 19 from the test matrix,
  and add workflow concurrency control and a job timeout.

## [0.6.0] - 2023-06-22

### Added

- Add CSpell spell-checking to the repository's own lint pipeline.

### Changed

- Bump the pinned Node.js version to 16.20.1.
- Simplify the Reviewpad workflow configuration: trim explanatory comments,
  enable merge metrics, drop the pull-request title-lint and Terraform-file
  labeling rules, and fix the dependency label to match the Yarn lockfile.
- Expand the CSpell configuration with an additional dictionary.
- Update VSCode editor settings, consolidating the CSpell and Reviewpad
  JSON/YAML schema associations and removing a redundant ESLint setting.

## [0.5.0] - 2023-06-10

### Added

- Add a Reviewpad configuration to automate pull request labeling,
  summarization, and conventional-commit checks.

### Changed

- Upgrade the pinned Yarn release to 3.6.0.

## [0.4.0] - 2023-05-24

### Changed

- Refine the CSpell configuration: move to explicit dictionary entries (dropping
  the Esperanto and Lorem Ipsum dictionaries) and trim ignore paths/words
  already covered elsewhere.

### Fixed

- Fix the VSCode CSpell schema association to point at the correct configuration
  filename (`cspell.config.yml`).

## [0.3.3] - 2023-05-06

### Changed

- Update the pinned Yarn release to v3.5.1.
- Update dependencies across the workspace (multiple maintenance passes).

### Fixed

- Fix the repository's own `.eslintrc.yml` to reference the renamed shared
  ESLint config package (previously a stale extends entry).

## [0.3.0] - 2023-04-24

### Changed

- Update dependencies across the workspace.

### Removed

- Drop support for Node.js v14; the minimum supported Node.js version is now
  v16.20 (breaking change).

## [0.2.8] - 2023-04-22

### Added

- Add Node.js v20 to the CI test matrix.

### Changed

- Update dependencies across the workspace.

## [0.2.7] - 2023-04-07

### Added

- Add a Husky pre-commit safeguard that prints a clear error message when the
  Prettier config hasn't been built yet (i.e., forgetting to run
  `yarn install`).

### Changed

- Update dependencies across the workspace (multiple maintenance passes).
- Tweak internal development npm-scripts: allow unlimited parallel jobs for
  `start` and expand the `clean:root` glob.

### Fixed

- Fix the npm publish access configuration in `.yarnrc.yml` so packages publish
  as public instead of restricted.

## [0.2.0] - 2023-03-29

### Changed

- Update dependencies across the workspace.

## [0.1.2] - 2023-03-23

### Added

- Publish the initial release of the shared configuration monorepo, including
  the CI workflow, EditorConfig, Husky git hooks, Yarn Berry tooling,
  contribution guidelines, and code of conduct.
- Add a project logo, referenced from the README.

### Changed

- Improve the README documentation.
- Expand ignore-file patterns in `.eslintignore` and `.gitignore`.
- Update dependencies.

### Removed

- Remove a restrictive private npm publish setting from the Yarn configuration.
