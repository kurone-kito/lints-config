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
(bumped to v0.11.0 by #312, recorded here in #316, superseding the
v0.7.0 pin wired by #284/#288, which itself superseded the v0.6.0 pin
wired in #211) to a tag archive rather than `refs/heads/main`:

```text
https://codeload.github.com/kurone-kito/idd-skill/tar.gz/refs/tags/v0.11.0
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
`pnpm-lock.yaml` entry recorded against it goes stale silently.
`pnpm install --frozen-lockfile` in CI would then either keep resolving
a months-old integrity hash or start failing after an unrelated
upstream push. Upstream's own manifest generator flags this directly:
*"Pass `--package-spec` with a pinned tarball URL or reviewed commit
archive when you need reproducible helper imports."*

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
profiles later), refresh `pnpm-lock.yaml`, and re-verify
`pnpm run idd:doctor` emits a real verdict. `pnpm-workspace.yaml`'s
`allowBuilds` entry for this package must be updated to the new pinned
spec string in the same change. This was originally recorded here as
failing closed with an `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` error on
a stale key, but that error did not reproduce during the v0.7.0 bump
(#284) under the currently installed `pnpm@11.15.1`: an unfrozen
`pnpm install` with a stale `allowBuilds` key installed and built the
new git dependency silently, with no warning about a skipped or
ignored build script (recorded here, #288). Update the key regardless
— to keep the three pin locations character-for-character identical —
and verify it manually rather than relying on an install failure to
catch a missed update.

**Trade-offs accepted, not overlooked** (recorded per #174):
`pnpm install` now depends on GitHub's codeload archive endpoint being
reachable on every CI matrix job. The `idd:*` scripts this profile adds
grew from 38 at the v0.4.0 pin to 40 at v0.6.0 (`idd:onboard` and
`idd:merged-pr-feedback-sweep`) to 50 at the current v0.11.0 pin
(#312) — a real footprint increase for an otherwise small root
`package.json` — the `instructions-only` alternative (zero dependency,
zero scripts, at the cost of losing helper-collected evidence) was
considered and rejected on 2026-07-27.

**Node.js engines-floor coupling** (discovered during the v0.7.0 bump
by #284; recorded here, #288): a helper-runtime tag bump can silently
inherit a new `engines.node` floor from upstream `idd-skill`'s own
`package.json`. At v0.7.0, upstream raised its floor to `^22.23.2`,
one patch above this repository's then-current `22.23.1` floor; with
`pnpm-workspace.yaml`'s `engineStrict: true`, regenerating the
manifest against the new spec failed closed with
`ERR_PNPM_UNSUPPORTED_ENGINE` until #287 (bumping this repository's
own `engines.node` floor) landed first. Roadmap #283 had recorded #287
as unrelated to the helper-runtime pin with no dependency edge —
accurate at authoring time, but it stopped holding once upstream moved
its floor. A future re-sync should check upstream's target-tag
`engines.node` against this repository's current floor **before**
assuming no ordering dependency exists.

**pnpm engines-floor coupling** (checked ahead of time for the
`v0.11.0` bump; recorded here, #316): the same coupling risk applies to
`engines.pnpm`, not just `engines.node`. Unlike the `v0.7.0` cycle
above, which discovered the Node.js floor coupling mid-flight, this
re-sync checked the target tag's `engines.pnpm` *before* starting the
pin bump — confirming the earlier lesson's own recommendation to check
first rather than discover the hard way. The prerequisite bump
(`engines.pnpm` raised to `^12.4.0` for the `v0.11.0` pin) landed first,
via #323, so the `v0.11.0` helper-runtime bump (#312) itself hit no
`ERR_PNPM_UNSUPPORTED_ENGINE` failure.

## New v0.6.0 Policy Fields

Four fields the v0.6.0 policy schema added, and this repository's
position on each. The first two were recorded 2026-08-08 (#218); the
third and fourth were each revisited and recorded separately, on
2026-08-12 and 2026-08-13 respectively, per their own bullets below:

- **`helperRuntime.packageSpec`** — now set, mirroring the pin above
  (currently `refs/tags/v0.11.0`, per the v0.11.0 bump recorded above).
  Absent under the v0.4.0 pin; the
  field exists specifically to make the `package-manager` /
  `ephemeral-npx` invocation spec explicit rather than re-derived from
  `devDependencies` at runtime.
- **`advisoryWait.exemptBotAuthoredPrs`** — enabled (#215). Dependabot
  authors the majority of this repository's pull requests, and those
  PRs carry no claim history; without the exemption, advisory
  convergence's `idd-claimed` scoping would have nothing to resolve
  them against.
- **`ciGate.trustSourcePinnedRequiredChecks`** — **enabled** (recorded
  2026-08-12, operator decision after #209 landed). #209 (repository
  settings: required status checks) closed 2026-08-12 and configured all
  11 required checks on `main`'s branch protection as source-pinned
  entries (`app_id: 15368` — GitHub Actions' own app). The operator
  verified out-of-band that every required check-run's producer
  `app.id` matches that pin
  (`gh api repos/{owner}/{repo}/branches/main/protection` and the
  Checks API on a representative merge commit), so the source-pinning
  is trustworthy and this knob no longer needs to fail closed. Before
  this change
  landed, `pre-merge-readiness` and `idd-merge-execute` downgraded every
  required check to `unknown`/`source-pinned` regardless of its actual
  pass state, forcing a manual Checks-API read and a written-rules
  merge instead of the automated F2/F3 gate on every PR after #209
  closed (first hit while merging #254 for issue #251) — this was the
  placeholder-revisit condition the previous paragraph's now-superseded
  text anticipated.
- **`ciGate.trustEmptyProtectionReads`** — **enabled** (recorded
  2026-08-13, operator decision after `main`'s branch protection moved
  from classic protection to GitHub Rulesets). `pre-merge-readiness`
  reads both `rules/branches/main` (the effective-merged-rules
  endpoint) and the classic-only `branches/main/protection` endpoint,
  and treats a `404` on either as unreadable unless this flag is set.
  GitHub's REST permission model scopes these two endpoints
  differently (`rules/branches/{branch}` under Metadata read,
  `branches/{branch}/protection` under Administration read), so a
  successful `rules/branches/main` read does not by itself prove read
  access to the classic endpoint too — the operator verified this
  precondition directly instead, against the same automation token:
  `idd:doctor` successfully read `branches/main/protection` with real
  content (11 configured required status checks) at the start of this
  session, before the Rulesets migration removed classic protection
  from this repository entirely. That prior success is direct,
  same-token evidence of working Administration-read access on this
  endpoint, so the `404` it now returns reflects nothing configured
  there — the resource was replaced, not that access was lost — rather
  than an unreadable state. Before this change landed,
  `pre-merge-readiness` reported `{"gate": "ci", "detail": "cannot
  determine required checks: protection/ruleset unreadable"}` on effectively
  every PR, forcing a manual `gh pr checks`/`gh pr view` cross-check on
  each one instead of the automated F2/F3 gate. This does not affect
  `idd-doctor`'s separate `branch protection not readable` warning,
  which comes from
  a different code path with no equivalent config opt-in.

  **v0.7.0 re-verification** (recorded 2026-08-20, #288): upstream's
  `v0.7.0` `CHANGELOG.md` records that `idd-doctor` governance reads
  now natively honor GitHub Rulesets and `trustEmptyProtectionReads`,
  adding first-class support for the Rulesets-migration scenario this
  flag was originally recorded above to work around, rather than
  leaving this entry describing only the pre-v0.7.0 workaround
  framing. Re-ran `pnpm run idd:doctor` against this repository's
  current state (Rulesets already migrated, this flag still `true`):
  `result: passed (1 warning(s))`, the sole warning being the
  pre-existing, unrelated release-tag-drift notice — no new warning
  about this flag. The flag's value is unchanged; nothing in the
  re-verification indicated it is no longer needed.

## New v0.7.0 Policy Fields

Two fields the v0.7.0 policy schema added, and this repository's
position on each. Both recorded 2026-08-20 (#288):

- **`authoringLanguage`** — set explicitly to `"en"`. The schema's
  documented fail-safe default when this field is absent is already
  `"en"` — not the operator's live conversational language; only the
  literal `"match-source"` value tracks that — so this setting is an
  explicit recording of already-current behavior: durable and
  auditable against a future change to the fail-safe default, and
  consistent with this repository's English-prose convention for
  issues and docs regardless of a given authoring session's
  conversational language. Landed vs. pending: PR-submit applies this
  field to PR body prose and the issue-authoring skill applies it to
  drafted issue prose; the distributed discover/claim runtime does not
  read or apply it yet (see `docs/customization.md`'s "Authoring
  Language" section).
- **`critiqueLoop.delegate`** — not adopted. This optional field points
  the C1 self-review pass at a configured external command (for
  example a local CLI reviewer) instead of the hardcoded per-agent
  critique table; this repository has no such command configured, so
  C1 continues to use the per-agent Critique pass invocation table
  (see "Critique-Loop Profile" above). Recorded as a deliberate
  non-adoption, not an oversight.

## Provider Outage Policy

**Policy**: adopted, with conservative defaults (recorded 2026-09-07,
operator decision; re-confirmed 2026-09-12 during the `v0.11.0`
retarget; #315).

`v0.8.0` added the `providerOutage` declaration/park policy: a
repository-scoped, time-boxed declaration that substitutes for
repeatedly posting a per-pull-request external-check waiver while the
primary advisory bot is genuinely unavailable for hours, not minutes.
Adopted values:

```json
{
  "providerOutage": {
    "declarationTarget": 329,
    "maxValidity": "PT6H",
    "maxParkedChanges": 3
  },
  "ciGate": {
    "externalChecks": {
      "waivable": [{ "selector": "idd-advisory-convergence" }]
    },
    "externalCheckWaivers": {
      "mode": "maintainer-authorized",
      "authorityPolicy": "owners-and-maintainers-only",
      "maxValidity": "PT24H"
    }
  }
}
```

- **`providerOutage.maxParkedChanges: 3`** — conservative, given this
  repository's low pull-request volume and solo-maintainer profile:
  once three PRs are parked for an unavailable provider service,
  sessions stop claiming new issues rather than manufacturing more
  unmergeable pull requests.
- **`providerOutage.maxValidity: "PT6H"`** — shortened from the
  schema's `PT24H` default at the operator's explicit request, favoring
  frequent re-declaration over one long-lived declaration that could
  silently outlive a resolved outage.
- **`providerOutage.declarationTarget: 329`** — issue
  [#329](https://github.com/kurone-kito/lints-config/issues/329),
  "Provider outage declarations (persistent tracking issue)", created
  and immediately closed as this policy's permanent bookkeeping
  mailbox. It stays closed so Discover's orphan and roadmap scans never
  surface it as a candidate; the declaration helper reads its comment
  history via the GitHub API regardless of issue state.
- **`ciGate.externalChecks`/`externalCheckWaivers`** — this
  repository's only relevant required check is
  `idd-advisory-convergence` (GitHub Ruleset check, #209). Before this
  change, `.github/idd/config.json` had no `ciGate.externalChecks`/
  `externalCheckWaivers` block at all, so the `providerOutage`
  declaration alone would have relieved nothing: an active declaration
  only relieves selectors listed in `ciGate.externalChecks.waivable`,
  and only once `externalCheckWaivers.mode` is
  `maintainer-authorized`. This track wires both together so the
  declaration policy actually has an effect, making
  `idd-advisory-convergence`'s external-check-waiver path usable during
  a sustained Copilot outage for the first time.
- **Scope: this waiver covers only an advisory-bot outage.** It relieves
  `idd-advisory-convergence` only when the check-run itself exists
  (GitHub Actions is up) but stays blocked because the advisory bot
  has not reviewed — there, a real check-run exists for the waiver to
  override. It does **not** help when GitHub Actions itself is down: no
  check-run is ever produced to waive, and GitHub's required-check
  topology stays non-waivable by the IDD contract regardless of waiver
  mode (`docs/policy-constants.md`'s External-Check Waiver Defaults). A
  GitHub Actions platform outage is a separate scenario this waiver does
  not address — the pre-existing provider-outage park flow (also
  bounded by `providerOutage.maxParkedChanges` above, via a `ci-actions`
  blocker) already covers that case independently of this waiver.

## New v0.8.0-v0.11.0 Policy Fields

This repository never applied the `v0.9.0` intermediate release: #316
(recorded here) covers the residual `v0.8.0`-`v0.11.0` policy decisions
in one pass, following the `v0.11.0` pin (#312) and instruction/docs
re-import (#313). Sibling tracks #314 and #315 each record their own
`idd-advisory-convergence-comment.yml` and `providerOutage` adoption
decisions inline — not restated here.

- **`mergePolicyAck`** — set to `"fully_autonomous_merge"` (#312),
  matching the already-recorded `mergePolicy` value. Diagnostics-only:
  it silences `idd-doctor`'s mismatch warning and never participates in
  F2.5/F3 merge-authority resolution. `mergePolicy` itself was
  re-confirmed as `fully_autonomous_merge` on 2026-09-12 (#316), despite
  `v0.8.0`'s flip of the distributed default to `human_merge` for new
  adopters — this repository's existing, deliberate divergence (see
  "Merge Policy" above) stands unchanged.
- **`developmentBranch`** — set to `"main"` (recorded 2026-09-12, #316).
  Optional; absent would already resolve to the live GitHub default
  branch (also `main`), so this changes no behavior, but is recorded
  explicitly for clarity, confirmed via a live `idd-onboard --hear
  --propose` run on 2026-09-12.
- **`provider`** — not set. Absent resolves to `github`, and no adapter
  exists yet for `gitlab`/`bitbucket`.
- **`advisoryBotLogins`** — set to `["coderabbitai[bot]"]` (recorded
  2026-09-12, #316). This field governs which **non-Copilot** bots' PR
  review-comment acknowledgements may be classified as structurally
  ack-only by the helper evidence layer (Copilot has its own dedicated
  advisory-wait protocol, scoped separately); CodeRabbit is this
  repository's only configured **non-Copilot** advisory reviewer
  (`.coderabbit.yaml`; see "PR Review Policy" above, which keeps both
  GitHub Copilot and CodeRabbit enabled as advisory reviewers).
  Separately, the `idd-suggest-untrusted-labelers`
  helper (run 2026-09-12, a read-only scan of this repository's actual
  label history across 2080 scanned events) shows zero observed
  activity from `chatgpt-codex-connector[bot]` — corroborating, not the
  sole basis for, leaving it out.
- **`upstreamEscalation.enabled`** — set to `true` (recorded
  2026-09-12, #316). This repository actively dogfoods `idd-skill`; the
  operator opted in (confirmed 2026-09-12) to let a worker session flag
  a high-confidence `idd-skill` upstream defect discovered during this
  repository's own IDD work as a local `status:upstream-candidate`
  issue, using the marker mechanism and "Upstream-candidate escalation"
  appendix subsection the instructions re-import (#313) brought in. Per
  that subsection, the `status:upstream-candidate` label is created on
  first use by whichever session first triggers the escalation (the
  same lazy-creation pattern already used for `status:authoring`) — no
  pre-creation step is needed here.
- **`discover.milestoneScope`** — not applicable. Confirmed via the
  GitHub API (2026-09-12) that this repository has zero milestones
  configured.
- **`critiqueLoop.delegate`** — still not adopted (unchanged from the
  `v0.7.0` decision above); no delegate command is configured.
- **Deferred this round** (confirmed 2026-09-12, #316; revisit only if
  a concrete need arises): `labels.untrustedLabelerLogins`
  (schema-supported metadata only, no runtime enforcement yet),
  `advisoryWait.secondaryQuietWindow`,
  `advisoryWait.providerOutage.terminalWindow`,
  `advisoryConvergence.copilotReviewPollInterval`
  (`copilotReviewPollMaxWait` adopted separately — see
  "Advisory-Convergence Copilot-Review Poll Window" below),
  `localValidationEvidence.maxAge`,
  `providerHealth.minCorroboratingPrs` / `samplingWindow`,
  `critiqueLoop.deferAfterRounds`, `critiqueLoop.telemetryHook`,
  `issueAuthoring.heartbeatCoalesceWindow`,
  `issueAuthoring.journalIssue`,
  `worktreeGuard.refuseBaseBranchCommits` (`worktreeGuard` itself
  remains entirely unconfigured/inactive, unchanged — see
  "Deliberately Unadopted Extensions" below), and
  `mergeGate.soloCodeownerAdminFallback` (left at its own distributed
  default). `providerOutage.*` is the one exception in this schema
  area: it is intentionally left out of this deferred list because a
  separate track, #315, owns adopting it — not because it is already
  active. As of this recording (2026-09-12), `.github/idd/config.json`
  had no `providerOutage` key yet, so per `docs/customization.md`'s own
  rule ("omit `declarationTarget` to keep the declaration path disabled
  entirely"), the declaration path stayed disabled until #315's adoption
  landed; this entry made no claim that it was active at the time.
  **Update**: #315's adoption has since landed and added
  `providerOutage` — see "Provider Outage Policy" above for the
  now-active configuration.
- **`package.json` `idd:*` script-alias set** — this bump (#312)
  followed the freshly regenerated `v0.11.0` `package-manager`-profile
  manifest output exactly, per this repository's own recorded bump
  procedure ("apply the manifest output in full"; see "Helper Runtime
  Profile" above).
- **Optional `idd-spec-audit` skill** (new upstream at `v0.10.0`) — not
  adopted this round (#316). This repository only re-syncs the
  already-installed `issue-authoring` skill (see "Issue-Authoring
  Companion" below). Adopting a new skill is a separate decision, out
  of scope for this version-bump roadmap.

## Advisory-Convergence Copilot-Review Poll Window

**Decision**: `advisoryConvergence.copilotReviewPollMaxWait` set to
`"PT180S"` (recorded 2026-09-14, #336). `copilotReviewPollInterval`
stays unset, keeping the shipped 7.5 s
(`DEFAULT_COPILOT_REVIEW_POLL_INTERVAL_MS`) poll cadence — only the
total wait ceiling changed.

This revisits, and partially supersedes, the "Deferred this round" note
under "New v0.8.0-v0.11.0 Policy Fields" above, which had left both
`advisoryConvergence.copilotReviewPollInterval` and
`copilotReviewPollMaxWait` unconfigured. `copilotReviewPollInterval`
stays deferred; only `copilotReviewPollMaxWait` is adopted here.

**Evidence** (as reported during the 2026-09-13 IDD execution of
roadmap #311 and its follow-ups, not independently reproduced by this
session): the `idd-advisory-convergence` required check's own short
bounded poll for a Copilot review
(`scripts/advisory-convergence.mjs`'s `readCopilotReviewPollPolicy`,
shipped default `DEFAULT_COPILOT_REVIEW_POLL_MAX_WAIT_MS = 60_000`,
i.e. 60 s — confirmed against the installed package source)
repeatedly timed out before Copilot's review actually landed on the
same HEAD. Once each affected check-run instance had already used its
one-time `rerun-once` budget (`ciWait.rerunPolicy`), GitHub's
required-check rollup stayed blocked even though the substantive
verdict and the latest run were both green, requiring a maintainer to
manually rerun each stuck instance. This happened on 5 of the 9 PRs
processed that day (#326, #328, #330, #332, #335). On at least two of
those occasions, the actual delay before Copilot's review landed was
reported at roughly 70+ seconds — past the 60 s ceiling then in
effect.

**Why `PT180S`**: the `idd-advisory-convergence` job's own
`timeout-minutes: 10` budget (confirmed directly against
`.github/workflows/idd-advisory-convergence.yml`) leaves ample headroom
for a 180 s (3 min) internal poll ceiling, comfortably above the
reported ~70 s delay, without risking the job's own timeout.
`docs/policy-constants.md`'s own field-evidence note for this same key
(166-229 s observed on a `vendored-node` adopter) sits above this
repository's own ~70 s observation but still well under `PT180S`,
reinforcing that this ceiling has headroom for a slower-landing review
too, not only the delay actually observed here.

**Out of scope**: `docs/policy-constants.md` documents this field's
upstream *shipped default* (`PT60S`) and onboarding guidance, not a
per-repository decision; it needs no edit here — this repository's own
override is recorded in this file and in `.github/idd/config.json`
alone.

## Up-to-Date-Head Ruleset

**Decision**: disabled (recorded 2026-08-08, ONBOARDING Step 1B
decision 13).

This decision matched the factual state at the time it was recorded —
`required_status_checks` was `null` and this repository had zero
rulesets — and upstream's own recommendation. An up-to-date-head
requirement forces a `main`-sync merge on every merely-`BEHIND` (not
conflicting) PR before it can merge; upstream's measured before/after
sample recorded the sync-merge share falling from ~27% to ~3.7% once
the requirement was disabled
([kurone-kito/idd-skill#1817](https://github.com/kurone-kito/idd-skill/issues/1817)).

This was a **constraint on issue #209's implementation**
(repository-settings: required status checks), not merely a preference
recorded ahead of it — that work had to avoid introducing an
up-to-date-head requirement as a side effect of registering required
checks. #209 closed 2026-08-12 with `required_status_checks.strict: false`,
confirming the constraint held.

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

**`v0.11.0` re-verification** (recorded 2026-09-12, #316): confirmed
this bridge-not-import decision still holds at `v0.11.0`. Diffed all
three files against the installed `v0.11.0` package's `idd-template/`
copies directly: `.cspell.config.yml` and `.markdownlint.yml` still
diverge from the template exactly as described above (`import`/
`extends` from the published `@kurone-kito/*-config` packages, plus
this repository's own additions), and `.markdownlint-cli2.yaml` needed
no change, matching the original decision. The instructions re-import
(#313) merged this repository's own additions forward into the
`v0.11.0`-shaped `.cspell.config.yml`, the only content change needed
this round; the two markdownlint files are unchanged upstream between
`v0.7.0` and `v0.11.0`.

## Onboarding Meta-Doc Placeholder Corruption

**Decision**: manual restoration only, no tooling fix (recorded
2026-08-08, #224).

`idd-onboard --substitute` performs a blind global find-and-replace of
the seven onboarding placeholder tokens across every copied file. That
is correct for files that consume the placeholders, but three meta-docs
exist specifically to *document the placeholder syntax itself* —
`docs/onboarding/placeholders.md`, `docs/customization.md`, and
`docs/onboarding/policy-decisions.md`. Running `--substitute` against
this repository corrupts their literal `{{...}}` token displays into
this repository's resolved values, since the tool has no
escaping or path-exclusion mechanism and upstream's own template has
the same behavior against its own docs.

If a future `idd-onboard --substitute` re-run touches these three
files again, the fix is the same manual restoration #224 applied: diff
the corrupted file against the raw upstream file (at the currently
pinned tag) with the seven placeholders re-substituted back to this
repository's resolved values, confirm no other content diverges, and
copy the raw upstream file back in verbatim. Do not attempt to patch
the substitution tool itself as part of a routine re-sync; that is a
separate upstream-facing change outside this repository's scope.

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
- **`idd-advisory-convergence.yml`'s `ubuntu-slim` runner-fallback
  default** (upstream since v0.7.0): not adopted (recorded 2026-08-20,
  #288; re-confirmed 2026-09-12, #316). The workflow's `runs-on:`
  fallback stays `ubuntu-latest`, per the workflow's own header comment
  recording an explicit, issue-referenced (#183) choice to preserve the
  `CI_RUNNER_LABEL`-override *mechanism* without hardcoding a specific
  runner label (roadmap #283, decision 4). Re-verified directly against
  the installed `v0.11.0` package: upstream's own shipped default is
  still `ubuntu-slim`, and its rationale is unchanged between `v0.7.0`
  and `v0.11.0` — no new information forces reconsideration. Standing,
  deliberate divergence — no runner-value change is part of this track.

The `idd-advisory-convergence-comment.yml` companion workflow,
previously recorded here as not adopted (recorded 2026-08-20, #288,
roadmap #283 decision 3, because its classifier script
`scripts/review-comment-origin.mjs` had no published `package.json`
`bin` entry in the installed `v0.7.0` package), is **no longer
unadopted**: that blocker is resolved and re-confirmed against
`v0.11.0` — the upstream package publishes `idd-review-comment-origin`
and `idd-advisory-comment-debounce` as `bin` entries (added at v0.9.0,
still present in `v0.11.0`'s 53-entry `bin` set), both directly
runnable via `pnpm exec` once the `v0.11.0` pin (#312) was installed,
with no `package.json` script alias required. `.github/workflows/
idd-advisory-convergence-comment.yml` was adopted (recorded
2026-09-13, #314), alongside the required workflow's own
`pull_request_review` trigger moving from
`idd-advisory-convergence.yml` to this new non-required companion
(the interim arrangement documented in that file's own header and
inline comments, kept only until this companion landed). It is
registered as adopted but **not** added to any GitHub
branch-protection Ruleset required-checks list — it stays advisory/
best-effort by design, unlike the required workflow. The
`idd-advisory-convergence.yml` runner-fallback divergence recorded
above (`ubuntu-latest`, not `ubuntu-slim`) still holds for this
companion workflow too, so the two paired workflows do not drift onto
different runner defaults.

The `idd-advisory-convergence` required-check CI workflow, previously
recorded here as deferred (2026-07-27), is **no longer unadopted**:
`.github/workflows/idd-advisory-convergence.yml` was adopted in #215,
and is now registered as a **required** GitHub status check on
`main`'s Ruleset (#209, closed 2026-08-12; this entry's prior sentence
describing registration as still-pending was stale — corrected
2026-08-20, #288, confirmed via the Rules API) — non-bypassable, not
merely reporting.

## Bootstrap note (historical)

Before this import (#166) landed, IDD execution for this repository's
adoption-track issues used the **upstream IDD flow**: reading phase
instructions directly from a local `kurone-kito/idd-skill` clone,
substituting the confirmed onboarding values recorded in #164. That
bootstrap period is over — this file and the imported
`.github/instructions/` set are now the canonical source for future
sessions.
