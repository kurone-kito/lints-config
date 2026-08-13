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

`typescript-config` moved to
[`kurone-kito/builder-config`](https://github.com/kurone-kito/builder-config).
`eslint-config-base`, `eslint-config-react`, `eslint-config-solid`, and
`prettier-config` were discontinued outright in
[#134](https://github.com/kurone-kito/lints-config/pull/134) — not
moved anywhere — when this repository migrated its own linting and
formatting tooling to Biome (see the README's "Discontinued packages"
section for the full context). All five packages are permanently out
of scope for this repository's changelogs either way — do not create
or reference a `CHANGELOG.md` for them here.

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
publishing. All three passes use the same classification method below;
the initial draft and recompute also share the same diff command, but
the final gate uses a different one (see that section).

### The diff command

Used by the initial draft and the recompute before merging:

```sh
git fetch --tags origin main
git diff --no-renames --name-status \
  "$(git describe --tags --abbrev=0 origin/main)"..origin/main
```

Resolve the tag from `origin/main`, not local `HEAD`: `git describe`
without an explicit commit-ish resolves from `HEAD`, which can lag
behind `origin/main` (for example if a newer release tag lands on
`main` after this branch was created), reprocessing the wrong release.

Classify each line's path into root vs. package buckets per the
file-path-attribution method above, then synthesize each affected file
group's `CHANGELOG.md` bullet from the commits/PRs that actually
touched any path in that group, per the Attribution rule above — not
merely from a path appearing in this list, so a second, unrelated
change to an already-covered group still gets counted.

Use `--name-status`, not plain `--name-only`: `--name-only` prints
only the destination path for a detected rename, dropping the source
package's removal note entirely. Add `--no-renames`: a rename without
it still carries both paths, but packed into one `R<score> <old> <new>`
line needing different parsing from the plain `A`/`M`/`D` lines
everything else uses; `--no-renames` instead splits a rename into
independent `D` (source) and `A` (destination) lines, so both sides
attribute with the same one-path-per-line handling as everything else.

All three passes below fetch and diff against `origin/main`'s current
tip, including the initial draft: this never includes the release-prep
branch's own version-bump/CHANGELOG commits regardless of when they
are made, and never misses a commit that landed on `main` after the
branch was created.

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
Merge the release-prep PR — or, if a follow-up was needed per the rule
below, its latest follow-up — on the same calendar day as the publish
date that ends up in step 1's `YYYY-MM-DD`, so this gate is normally a
read-only confirmation that finds nothing new. Immediately before
publishing:

1. Refresh the `## [x.y.z] - YYYY-MM-DD` date to the publish date.
2. Fetch `origin main` again, then diff the release-prep merge commit
   against `origin/main`'s current tip:
   `git diff --no-renames --name-status <release-prep-merge-sha>..origin/main`
   — not `<last-tag>` again. Comparing from the merge commit, which is
   already fully accounted for, shows only what landed on `main`
   afterward, so the merge's own version bump and `CHANGELOG.md` edits
   never reappear as if they were newly-changed. Handle anything this
   shows the same way as the recompute-before-merging step above.
   **Known residual risk**: a PR merged to `main` in the narrow window
   between the last recompute-before-merging check and the release-prep
   merge itself is not caught by this diff, since it is already folded
   into the merge commit's own tree. Keep that window as short as
   possible — merge immediately after a clean recompute, with no
   unrelated delay in between — rather than trying to detect it after
   the fact; closing it completely needs commit-by-commit history
   inspection this procedure intentionally does not require.
3. Correct the release draft's title and tag if they do not match the
   bumped `package.json` version — check this regardless of whether
   the bump changed during recomputation, since a release planned as
   minor/major from the very first pass needs the same correction.
   Do this here, not at the earlier merge step, and only after every
   `update_release_draft` run currently in flight has finished — not
   only the release-prep merge's own run, but also any triggered by
   an unrelated PR being opened, reopened, or synchronized around the
   same time (`.github/workflows/push-main.yml` runs that job on both
   triggers). The release-drafter action regenerates the draft's
   title and tag from `$NEXT_PATCH_VERSION` on every one of those
   runs (see the known gap under Existing release mechanics below),
   so correcting while any run is still in flight does not survive
   to this point.

If this gate finds a repository change that needs correction (a stale
date, a missing `CHANGELOG.md` entry, a wrong SemVer bump), apply it
through a normal follow-up PR — open, review, merge. Immediately
before merging it, re-run step 2 once more from the previous baseline
and fold in anything newly found, the same way the
recompute-before-merging step does; only then advance step 2's
baseline to the follow-up PR's own merge commit, then repeat this
gate — including
step 1, so the refreshed `YYYY-MM-DD` matches the follow-up merge's
own calendar day, per the requirement above. Never commit directly to
`main` to patch a release in progress.

Step 3's release-draft title/tag correction is GitHub metadata, not
repository content, so it falls outside this follow-up-PR rule —
correct it directly there, once every in-flight `update_release_draft`
run has settled.

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

`release.yml` also accepts a manual `workflow_dispatch` trigger, used
to publish an alpha/prerelease build under the `next` npm dist-tag
without creating a git tag or a GitHub Release (the packing/asset-
upload step stays gated to the `release` event, so a manual dispatch
skips it). This used to be a separate `release-next.yml` workflow;
it was folded into `release.yml` so both trigger paths share one
workflow filename, since npm Trusted Publisher configuration allows
only one registered workflow filename per package.
