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

Instead, the person or agent preparing a release derives entries in
three passes: an initial draft, computed before the version-bump/
CHANGELOG commit that opens the release-prep PR, a recompute
immediately before merging it, and a final check immediately before
publishing. All three passes use the same diff command and
classification method below.

### The diff command

```sh
git fetch origin main
git diff --no-renames --name-status <last-tag>..origin/main \
  -- ':(exclude)CHANGELOG.md' ':(exclude)**/CHANGELOG.md'
```

Classify each line's path into root vs. package buckets per the
file-path-attribution method above, then synthesize each affected
path's `CHANGELOG.md` bullet from the commits/PRs that actually
touched it — not merely from the path appearing in this list, so a
second, unrelated change to an already-listed path still gets counted.

Use `--name-status`, not plain `--name-only`: `--name-only` prints
only the destination path for a detected rename, dropping the source
package's removal note entirely. Add `--no-renames`: a rename without
it still carries both paths, but packed into one `R<score> <old> <new>`
line needing different parsing from the plain `A`/`M`/`D` lines
everything else uses; `--no-renames` instead splits a rename into
independent `D` (source) and `A` (destination) lines, so both sides
attribute with the same one-path-per-line handling as everything else.
Exclude `CHANGELOG.md` paths: they are this procedure's own output, not
release input, so without the exclusion a pass run after an earlier
pass's `CHANGELOG.md` edits already landed on `origin/main` would treat
those generated edits as newly-changed source and misattribute them.

All three passes below fetch and diff against `origin/main`'s current
tip, including the initial draft: before the release-prep branch has
any commits of its own, its `HEAD` equals `origin/main` anyway, so
there is no reason to special-case it, and diffing `origin/main`
uniformly means a rerun never includes the branch's own version-bump
commit regardless of when that commit was made, and never misses a
commit that landed on `main` after the branch was created.

Each pass moves its findings into a `## [x.y.z] - YYYY-MM-DD` section
at the top of each affected `CHANGELOG.md`, leaving `## [Unreleased]`
present but empty for the next cycle. The `YYYY-MM-DD` date is the
publish date (set at the final gate below), not the date the
release-prep PR was opened or merged.

### Recompute before merging

This repository runs multiple parallel IDD agents, so another PR can
merge to `main` after the initial draft but before the release-prep PR
merges; left unhandled, that change reaches the release tag with no
CHANGELOG entry. Immediately before merging — not only when the PR was
opened — re-run the diff command above. If the refreshed set needs a
larger SemVer bump than already chosen, re-evaluate it now; the
release draft's title/tag correction itself waits for the final gate
below (see why there). Repeat this recompute after every subsequent
push to the release-prep PR, and merge once it finds nothing new.

### Final gate: immediately before publishing

Publishing the GitHub Release, not the release-prep merge, is the
actual point of no return (see Existing release mechanics below).
Immediately before publishing:

1. Refresh the `## [x.y.z] - YYYY-MM-DD` date to the publish date.
2. Re-run the recompute above once more.
3. Correct the release draft's title and tag if they do not match the
   bumped `package.json` version — check this regardless of whether
   the bump changed during recomputation, since a release planned as
   minor/major from the very first pass needs the same correction.
   Do this here, not at the earlier merge step, and after the
   release-prep merge's `update_release_draft` run has finished:
   release-drafter regenerates both from `$NEXT_PATCH_VERSION` on
   every push to `main`, including the release-prep merge itself (see
   the known gap under Existing release mechanics below), so an
   earlier or still-in-flight correction would not survive to this
   point.

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
