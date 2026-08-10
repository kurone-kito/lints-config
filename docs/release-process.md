# Release Process

This document records the CHANGELOG convention and the release
mechanics already implemented by this repository's CI. It is the
canonical, discoverable home for both, so future releases (and future
agents) do not have to dig through the issues that originally decided
them.

As of this writing, no `CHANGELOG.md` file exists yet anywhere in this
repository — a companion issue tracks the initial historical backfill.
The convention below is the target every `CHANGELOG.md` this
repository creates, now or later, must follow.

## CHANGELOG format

Every `CHANGELOG.md` in this repository follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Each file
starts with a `# Changelog` title and a short intro line noting it
follows Keep a Changelog and
[Semantic Versioning](https://semver.org/), then a `## [Unreleased]`
section, then one `## [x.y.z] - YYYY-MM-DD` section per release,
newest first. Use `### Added` / `### Changed` / `### Fixed` /
`### Removed` / `### Deprecated` / `### Security` subsections under
each version, omitting any subsection with no entries for that
version.

## File layout

One root `CHANGELOG.md`, plus one `CHANGELOG.md` in each of the five
published package directories:

- `packages/biome-config/CHANGELOG.md`
- `packages/commitlint-config/CHANGELOG.md`
- `packages/cspell-config/CHANGELOG.md`
- `packages/lint-staged-config/CHANGELOG.md`
- `packages/markdownlint-config/CHANGELOG.md`

Packages that moved to
[`kurone-kito/builder-config`](https://github.com/kurone-kito/builder-config)
(`eslint-config-base`, `eslint-config-react`, `eslint-config-solid`,
`prettier-config`, `typescript-config`) are permanently out of scope
for this repository's changelogs — do not create or reference a
`CHANGELOG.md` for them here.

## Attribution rule

A changed path under `packages/<name>/` for one of the five packages
above goes in that package's `CHANGELOG.md`. A changed path under a
moved package's former directory (the five moved-package names listed
under File layout) is excluded per that section's rule — never
attribute it to the root `CHANGELOG.md` either. Every other changed
path (root config, `.github/`, `docs/`, `scripts/`, `test/`, root
`README.md`, etc.) goes in the root `CHANGELOG.md`.

A release that touches multiple packages plus root gets one entry per
affected file group, not one entry per raw commit — synthesize a
concise, user-facing bullet per group from the commits/PRs touching
it. Skip pure lockfile-only or CI-only noise that has no user-visible
effect for a given package's own `CHANGELOG.md`, but do record
root-scoped CI/tooling changes in the root `CHANGELOG.md`.

Because this repository is lockstep-versioned (all five packages
always share one version number), a release that only changed some
packages still bumps every package's version, but only the changed
packages' `CHANGELOG.md` files gain a `## [x.y.z]` section for that
release — sparse per-package coverage is expected and correct, not an
omission to fix.

## Update timing — batch at release time, not per-PR

Do **not** ask individual PRs to append their own entry to
`## [Unreleased]` as part of that PR. This repository runs multiple
IDD agents on parallel branches; every PR editing the same
`## [Unreleased]` section of a shared `CHANGELOG.md` file is a
guaranteed, repeated merge-conflict source.

Instead, the person or agent preparing a release derives the
since-last-tag entries in one pass immediately before bumping
`package.json` version(s) and opening the release PR, using
`git diff --no-renames --name-status <last-tag>..HEAD`, classified by
changed path into root vs. package buckets per the file-path-attribution
method above. Use `--no-renames --name-status`, not plain `--name-only`:
`--name-only` prints only the destination path for a detected rename,
with no way to recover the source path at all, so a file moved from one
published package's directory to another would silently drop the
removal note from the source package's `CHANGELOG.md`. Plain
`--name-status` (without `--no-renames`) does carry both paths for a
rename, but packs them into a single `R100 <old> <new>` line that needs
special two-path parsing, unlike every other line's single path.
`--no-renames` avoids that: it splits each rename into independent `D`
(source) and `A` (destination) lines, so the same one-path-per-line
classification the Attribution rule already uses just works, with both
sides attributed to their own package's `CHANGELOG.md`. That pass moves
the accumulated changes into a new
`## [x.y.z] - YYYY-MM-DD` section at the top of each affected
`CHANGELOG.md`, leaves `## [Unreleased]` present but empty for the
next cycle, and includes those `CHANGELOG.md` changes in the same
release-prep commit/PR that bumps the version. The `YYYY-MM-DD` date
is the date the GitHub Release is actually published (see Existing
release mechanics below — publishing is what triggers the release
workflow), not the date the release-prep PR was opened or merged. If
publishing happens on a different day than drafting, refresh the date
immediately before publishing.

**Recompute immediately before merging, not only before opening the
PR.** This repository runs multiple parallel IDD agents, so another PR
can merge to `main` after the since-last-tag diff was first computed
but before the release-prep PR itself merges. Left unhandled, that
intervening change lands in the eventual release tag with no
CHANGELOG entry. Immediately before merging the release-prep PR — not
only when it was opened — fetch the latest `main` and re-run the diff
against its current remote tip: `git fetch origin main`, then
`git diff --no-renames --name-status <last-tag>..origin/main`. Diff
against `origin/main`, not against the release-prep branch's own
possibly-stale `HEAD`: staying on that branch and diffing
`<last-tag>..HEAD` again would miss any commit that landed on `main`
after the branch was created. If the refreshed diff surfaces entries
not already recorded, append them to the pending `## [x.y.z]` sections
before merging. If nothing new landed, merge as-is.

## Non-goal — do not ship in the npm tarball

Never add `CHANGELOG.md` to any package's `files` array in
`package.json`. The CHANGELOG stays a GitHub/repository-only artifact,
not a published package asset.

## Rejected alternatives

Dedicated changelog tooling — `changesets`, `conventional-changelog`,
`semantic-release`, or similar — was considered and rejected. Adopting
any of them adds a new dependency, which is an explicit ask-first
boundary for this repository, and none of them is needed for a small,
lockstep-versioned (all five packages always share one version
number) monorepo that already bumps versions by hand. Recording this
here so a future session does not "helpfully" reintroduce one.

## Enforcement

This is a documented human/agent procedure only, not a CI gate. No
`.github/workflows/*.yml` check verifies `CHANGELOG.md` was updated.

## Existing release mechanics

This repository already implements the following release flow;
this document describes it as shipped behavior, not a proposal:

1. A maintainer bumps `package.json` version(s) across the workspace
   and publishes the GitHub Release that `release-drafter` has been
   continuously drafting from merged PRs. **Known gap**:
   [`.github/release-drafter.yml`](../.github/release-drafter.yml)
   hard-codes `tag-template: v$NEXT_PATCH_VERSION`, so the draft's
   name and tag only auto-track a patch bump. On a minor or major
   version bump, the maintainer must manually correct the draft's
   release title and tag to the actual bumped `package.json` version
   before publishing — publishing the draft as-is would tag the
   release with the wrong version.
2. The `release: published` event triggers
   [`.github/workflows/release.yml`](../.github/workflows/release.yml),
   which calls the reusable
   [`common-release.yml`](../.github/workflows/common-release.yml)
   workflow.
3. `common-release.yml` installs dependencies, publishes every package
   to both the npm registry and the GitHub Packages registry, packs
   each package with `pnpm --filter "!*lints-config" -r pack`, and
   uploads the resulting `.tgz` files as release assets via
   `gh release upload`.

A separate `release-next.yml` workflow (not covered by the flow above)
publishes an alpha/prerelease build under the `next` npm tag without
creating a git tag.
