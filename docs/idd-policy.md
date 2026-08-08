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
(bumped to v0.6.0 in #211, superseding the v0.4.0 commit-archive pin
wired in #174) to a tag archive rather than `refs/heads/main`:

```text
https://codeload.github.com/kurone-kito/idd-skill/tar.gz/refs/tags/v0.6.0
```

The same string is set verbatim in three places: this `devDependencies`
entry, `pnpm-workspace.yaml`'s `allowBuilds` key, and
`.github/idd/config.json`'s `helperRuntime.packageSpec` (new in v0.6.0's
policy schema; see "New v0.6.0 Policy Fields" below).

**Why a tag, not a commit SHA**: a git tag is not a commit SHA — unlike
a branch ref, a tag is treated as immutable **by convention** (a repo
owner could force-move it), not by git's own guarantees. The operator
accepted that trade-off on 2026-08-08 for a readable pin and a readable
next bump; `v0.6.0` and upstream `main` were confirmed to be the same
commit (`0a9c90dc`) at pin time, so the tag lost no fidelity at that
moment.

**Why pinned at all (unchanged reasoning)**: `refs/heads/main` is a
floating ref — its content changes on every upstream merge, so a
`pnpm-lock.yaml` entry recorded against it goes stale silently. `pnpm
install --frozen-lockfile` in CI would then either keep resolving a
months-old integrity hash or start failing after an unrelated upstream
push. Upstream's own manifest generator flags this directly: *"Pass
`--package-spec` with a pinned tarball URL or reviewed commit archive
when you need reproducible helper imports."*

**Bump procedure**: review the upstream diff between the current pin
and the target tag, then regenerate the manifest against the new spec
and reapply it:

This repository has no local `scripts/` directory — the
`package-manager` profile installs the manifest generator as a wired
bin instead, so invoke it that way rather than the upstream source
repository's own `node scripts/helper-runtime-manifest.mjs` form:

```sh
pnpm exec idd-helper-bundle-manifest --profile package-manager \
  --package-manager pnpm \
  --package-spec https://codeload.github.com/kurone-kito/idd-skill/tar.gz/refs/tags/<new-tag>
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
reachable on every CI matrix job. The 40 `idd:*` scripts this profile
adds (38 at the v0.4.0 pin; v0.6.0 added `idd:onboard` and
`idd:merged-pr-feedback-sweep`) are a real footprint increase for an
otherwise small root `package.json` — the `instructions-only`
alternative (zero dependency, zero scripts, at the cost of losing
helper-collected evidence) was considered and rejected on 2026-07-27.

## New v0.6.0 Policy Fields

Three fields the v0.6.0 policy schema added, and this repository's
position on each (recorded 2026-08-08, #218):

- **`helperRuntime.packageSpec`** — now set, mirroring the pin above
  (`refs/tags/v0.6.0`). Absent under the v0.4.0 pin; the field exists
  specifically to make the `package-manager` / `ephemeral-npx`
  invocation spec explicit rather than re-derived from
  `devDependencies` at runtime.
- **`advisoryWait.exemptBotAuthoredPrs`** — enabled (#215). Dependabot
  authors the majority of this repository's pull requests, and those
  PRs carry no claim history; without the exemption, advisory
  convergence's `idd-claimed` scoping would have nothing to resolve
  them against.
- **`ciGate.trustSourcePinnedRequiredChecks`** — deliberately **not**
  set. This repository's branch protection carries no required status
  checks and zero rulesets (confirmed 2026-08-08: `required_status_checks`
  is `null`, `rulesets` returns an empty array), so a source-pinned
  required check is not yet a state that exists here for this knob to
  act on. Record this as a placeholder to revisit once #209 (repository
  settings: required status checks) lands, not as an oversight.

## Up-to-Date-Head Ruleset

**Decision**: disabled (recorded 2026-08-08, ONBOARDING Step 1B
decision 13).

Matches both the current factual state — `required_status_checks` is
`null` and this repository has zero rulesets — and upstream's own
recommendation. An up-to-date-head requirement forces a `main`-sync
merge on every merely-`BEHIND` (not conflicting) PR before it can
merge; upstream's measured before/after sample recorded the sync-merge
share falling from ~27% to ~3.7% once the requirement was disabled
([kurone-kito/idd-skill#1817](https://github.com/kurone-kito/idd-skill/issues/1817)).

This is a **constraint on issue #209's implementation**
(repository-settings: required status checks), not merely a preference
recorded ahead of it — that work must not introduce an up-to-date-head
requirement as a side effect of registering required checks.

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

**Native destination**: `.claude/skills/` — Claude Code's native skill
directory (recorded 2026-08-08 per #212 / ONBOARDING decision 10, which
now asks adopters to record this explicitly, distinct from the
upstream source repository's `skills/issue-authoring/` layout). The
bundle is deliberately **not** duplicated into another runtime root
(`.agents/skills/`, `.opencode/skills/`) — upstream advises against the
same skill ID living in multiple roots.

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

**Auto-labeler evidence** (recorded 2026-08-08, #219): this
repository's `.coderabbit.yaml` declares
`issue_enrichment.labeling.auto_apply_labels: false`, and that
declarative setting was **observed not to hold** — `coderabbitai[bot]`
applied the reserved `roadmap` label to #215 and #217 within seconds of
their creation, while #210's tracks were being authored. Why it
matters: Discover treats a roadmap-labelled issue as a roadmap root
rather than an execution candidate, so the failure mode is silent — a
mislabelled leaf issue simply drops out of the ready-to-start set with
no error and no visible cause. Omitting a label from a semantic
labeler's own instruction list does **not** restrict which labels it
may apply; that is not a mitigation. The declarative `.coderabbit.yaml`
setting remains recorded intent, not a control — `strip-untrusted-labels.yml`
(#219, `.github/workflows/strip-untrusted-labels.yml`) is the actual
enforcement, guarding four of this repository's five reserved label
names (`roadmap`, `status:blocked-by-human`, `status:needs-decision`,
`status:authoring`) against `coderabbitai[bot]`. `idd:ready` is not
enforced this way — it is applied only by a maintainer approval actor
under the Issue-Author Approval Gate above, not by a semantic
auto-labeler, so it carries no comparable auto-apply risk to guard
against.

## Doc-Lint Configuration Deviation

**Decision**: bridge, not import verbatim (recorded 2026-08-08, #213).

Upstream v0.6.0 added `.cspell.config.yml`, `.markdownlint.yml`, and
`.markdownlint-cli2.yaml` to the core template file list, so a target
repository with no doc-lint configuration of its own can import the
template and still pass its own linting. This repository is the
opposite case: it **publishes** `@kurone-kito/cspell-config` and
`@kurone-kito/markdownlint-config` and dogfoods both from its own root
configs, so importing the template's copies verbatim would silently
stop that dogfooding.

The concrete hazard that forced this decision: the template ships the
**dot-prefixed** `.cspell.config.yml`, but this repository's own root
config was the un-prefixed `cspell.config.yml`. In `cspell-lib`'s
config search order, `.cspell.config.yml` is evaluated *before*
`cspell.config.yml`, and the search stops at the first match — adding
the template file as a second, separate file would have silently
shadowed this repository's own config with no error and no warning.
The fix (#213) renamed the root config to the dot-prefixed path instead
of adding a second file: `.cspell.config.yml` now
`import: ['@kurone-kito/cspell-config']`, carries this repository's own
`cache:` block and word list forward, and does not copy the template's
narrower 9-dictionary list. `.markdownlint.yml` keeps
`extends: '@kurone-kito/markdownlint-config'` and adds only the two
rules the published package doesn't already cover
(`table-column-style`, `single-title`). `.markdownlint-cli2.yaml`
needed no change — its existing `ignores` list was already a superset
of the template's.

**This is a content divergence only.** All three files exist at their
template target paths, so `idd-onboard --verify`'s existence-based
`manifestCompleteness` check passes with no special-casing needed —
confirmed directly (#217's drift-check design deliberately does not add
a content comparison for these paths, since doing so would manufacture
exactly the false positive this section exists to explain away).

## Instruction Profile

The Lite instruction bundle (`.github/instructions/lite/`, 11 files) is
imported alongside the standard bundle, but `standard` stays the
default routing. No `instructionProfile` key is set in
`.github/idd/config.json` — the published policy schema's root object
rejects unknown properties, so the key would fail `idd-doctor`
validation outright rather than sitting inert. Restated and
**re-confirmed** (not merely carried forward) at v0.6.0: v0.5.0
hardened the Lite files and documented the model-capability tiers they
target, but this repository's own sessions run full-tier, attended
agents, so `standard` routing remains the deliberate operator choice
for this repository's own execution — the Lite bundle stays imported
for portability to a future lightweight-tier session, not because this
repository currently needs it.

## Deliberately Unadopted Extensions

These optional template extensions are recorded as intentionally not
adopted, rather than silently absent, per the #170 verification pass
(re-verified 2026-08-08 against v0.6.0, #218):

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

The `idd-advisory-convergence` required-check CI workflow, previously
recorded here as deferred (2026-07-27), is **no longer unadopted**:
`.github/workflows/idd-advisory-convergence.yml` was adopted in #215.
Registering it as a **required** GitHub status check on `main` remains
a repository-settings change tracked separately in #209 — the workflow
exists and reports on every PR, but nothing yet makes it non-bypassable.

## Bootstrap note (historical)

Before this import (#166) landed, IDD execution for this repository's
adoption-track issues used the **upstream IDD flow**: reading phase
instructions directly from a local `kurone-kito/idd-skill` clone,
substituting the confirmed onboarding values recorded in #164. That
bootstrap period is over — this file and the imported
`.github/instructions/` set are now the canonical source for future
sessions.
