# IDD Policy Configuration

This repository uses the following IDD policies. This is the canonical
human-readable record; `.github/idd/config.json` is the aligned
machine-readable mirror.

## Merge Policy

**Policy**: `fully_autonomous_merge`

Recorded 2026-08-01 (operator decision on #164), superseding the
`human_merge` value confirmed at onboarding (2026-07-14) and
re-confirmed 2026-07-27. Worker sessions execute the merge themselves
once `idd-pre-merge.instructions.md`'s F2 conditions are satisfied — no
per-PR human merge step.

Upstream's `docs/onboarding/policy-decisions.md` recommends
`human_merge` or `separate_merge_agent` — not `fully_autonomous_merge`
— specifically for unattended lightweight-tier sessions. This
repository's operator made the `fully_autonomous_merge` choice with
that recommendation already in view, for a full-tier, attended session.
Record this divergence explicitly rather than silently following the
default: if a future session runs unattended or on a lightweight tier,
re-confirm this choice still applies before relying on it.

## PR Review Policy

**Profile**: `copilot-advisory` — the copilot advisory review
posture. GitHub Copilot's automated review and CodeRabbit's
auto-review both stay enabled; both bots' comments are triaged as
advisory feedback rather than a merge-blocking gate.

## Review-Thread Resolution Policy

**Policy**: `fast-agent-resolve` (distributed default)

## Critique-Loop Profile

**Profile**: distributed defaults

## Claim Timing

- **claim-stale-age**: 24 h (distributed default)
- **claim-heartbeat-interval**: 12 h (distributed default)

## CI Wait Policy

- **running timeout**: `PT30M` / 30 min (distributed default)
- **generation timeout**: `PT10M` / 10 min (distributed default)
- **rerun policy**: `rerun-once` (distributed default)

## Credential Scope

**Worker credentials**: least-privilege worker scope.

**Merge-capable credentials**: granted (`fully_autonomous_merge`,
changed 2026-08-01). `.claude/settings.json` allows `gh pr merge` and
no longer denies `node scripts/idd-merge-execute.mjs` /
`node bin/idd-merge-execute.mjs`, mirroring
[`kurone-kito/idd-skill`'s own dogfood baseline](https://github.com/kurone-kito/idd-skill/blob/main/.claude/settings.json).

## Helper Runtime Profile

**Profile**: `package-manager` (pnpm; `packageManager` metadata and
`pnpm-lock.yaml` are the evidence).

The helper package (`@kurone-kito/idd-skill`) is not published to npm,
so it resolves from a GitHub archive URL. `devDependencies` pins it
(wired in issue #174) to a reviewed commit archive rather than
`refs/heads/main`:

```text
https://codeload.github.com/kurone-kito/idd-skill/tar.gz/f515fc34befc9026bdce4686fc6e41cc90e15c1d
```

**Why pinned**: `refs/heads/main` is a floating ref — its content
changes on every upstream merge, so a `pnpm-lock.yaml` entry recorded
against it goes stale silently. `pnpm install --frozen-lockfile` in CI
would then either keep resolving a months-old integrity hash or start
failing after an unrelated upstream push. Upstream's own manifest
generator flags this directly: *"Pass `--package-spec` with a pinned
tarball URL or reviewed commit archive when you need reproducible
helper imports."*

**Bump procedure**: review the upstream diff between the current pin
and the target commit/tag, then regenerate the manifest against the
new spec and reapply it:

This repository has no local `scripts/` directory — the
`package-manager` profile installs the manifest generator as a wired
bin instead, so invoke it that way rather than the upstream source
repository's own `node scripts/helper-runtime-manifest.mjs` form:

```sh
pnpm exec idd-helper-bundle-manifest --profile package-manager \
  --package-manager pnpm \
  --package-spec https://codeload.github.com/kurone-kito/idd-skill/tar.gz/<new-commit-sha>
```

Apply the manifest's `managedDependencies` and
`managedPackageJsonScripts` output to `package.json` **in full** (not
a hand-picked subset — a trimmed copy makes the manifest's own
`--from-profile` diffing report phantom changes when switching
profiles later), refresh `pnpm-lock.yaml`, and re-verify `pnpm run
idd:doctor` emits a real verdict. `pnpm-workspace.yaml`'s
`allowBuilds` entry for this package must be updated to the new pinned
spec string in the same change, or the install fails closed with an
`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` error.

**Trade-offs accepted, not overlooked** (recorded per #174): `pnpm
install` now depends on GitHub's codeload archive endpoint being
reachable on every CI matrix job. The 38 `idd:*` scripts this profile
adds are a real footprint increase for an otherwise small root
`package.json` — the `instructions-only` alternative (zero dependency,
zero scripts, at the cost of losing helper-collected evidence) was
considered and rejected on 2026-07-27.

## Issue-Author Approval Gate

- **Gate posture**: enabled-by-default
- **Opt-out state**: gate remains default-enabled — no
  `skipIssueAuthorApprovalGate` in `.github/idd/config.json`
- **`maintainer-approval-actors` policy**: `owners-and-maintainers-only`
- **Approval signals**: issue-author self-authorization (the sole
  maintainer authors every issue in this repository)
- **`approvalSignals.readyLabelName`**: `idd:ready` (distributed
  default, not yet exercised)
- **`approvalSignals.labelFreshnessMode`**: `presence-only`
  (distributed default)
- **Missing-approval behavior**: explicit-target stop-before-claim +
  discovery approval-needed fallback bucket (distributed default)

## Issue-Authoring Companion

**Status**: installed (#168) — `.claude/skills/issue-authoring/`.

- **`issueAuthoring.maxClarificationRounds`**: `3` (distributed
  default)

## Label Names

This repository keeps the distributed defaults: `labels.roadmapLabelName`
(`roadmap`), `labels.blockedByHumanLabelName` (`status:blocked-by-human`),
`labels.needsDecisionLabelName` (`status:needs-decision`), and
`approvalSignals.readyLabelName` (`idd:ready`). All five reserved
labels — `roadmap`, `status:authoring` (from the Issue-Authoring
Companion section above), `status:blocked-by-human`,
`status:needs-decision`, and `idd:ready` — exist in the repository
as of #170.

## Instruction Profile

The Lite instruction bundle (`.github/instructions/lite/`, 11 files) is
imported alongside the standard bundle, but `standard` stays the
default routing. No `instructionProfile` key is set in
`.github/idd/config.json` — the published policy schema's root object
rejects unknown properties, so the key would fail `idd-doctor`
validation outright rather than sitting inert.

## Deliberately Unadopted Extensions

These optional template extensions are recorded as intentionally not
adopted, rather than silently absent, per the #170 verification pass:

- **`idd-advisory-convergence` required-check CI workflow**: deferred
  (recorded 2026-07-27). The concept and job ID are referenced by the
  imported instruction files, but
  `.github/workflows/idd-advisory-convergence.yml` itself was not
  added — this repository does not host advisory-convergence checking
  as a required GitHub status check.
- **Worktree guard** (`.githooks/_idd-worktree-guard.sh`): imported
  but inactive. This repository's active hook manager is Husky, whose
  `prepare` script (`package.json`) generates a gitignored
  `.husky/_/` dispatch directory and points `core.hooksPath` at it —
  that generated directory won't appear by browsing the repository
  tree, only after `pnpm install` runs locally. Husky's own tracked
  hooks (`.husky/pre-commit`, `.husky/commit-msg`) do not source the
  guard script. Even if wired, the guard is opt-in by design and
  stays off unless `worktreeGuard.enabled` is `true` in
  `.github/idd/config.json`, which it is not.
- **`linguist-vendored` marking**: not applicable. This attribute only
  matters for the `vendored-node` helper runtime profile, which copies
  third-party helper files into the repository. This repository uses
  the `package-manager` profile (a pinned npm dependency, wired in
  #174) instead, so there is no vendored helper bundle to mark.

## Bootstrap note (historical)

Before this import (#166) landed, IDD execution for this repository's
adoption-track issues used the **upstream IDD flow**: reading phase
instructions directly from a local `kurone-kito/idd-skill` clone,
substituting the confirmed onboarding values recorded in #164. That
bootstrap period is over — this file and the imported
`.github/instructions/` set are now the canonical source for future
sessions.
