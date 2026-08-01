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

**Profile**: `copilot-advisory`. CodeRabbit auto-review stays enabled
and its comments are triaged as normal review feedback.

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
so it resolves from a GitHub archive URL. The archive **must be
pinned** to a reviewed commit or tag rather than `refs/heads/main` —
tracked by #174.

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
`labels.needsDecisionLabelName` (`status:needs-decision`).

## Instruction Profile

The Lite instruction bundle (`.github/instructions/lite/`, 11 files) is
imported alongside the standard bundle, but `standard` stays the
default routing. No `instructionProfile` key is set in
`.github/idd/config.json` — the published policy schema's root object
rejects unknown properties, so the key would fail `idd-doctor`
validation outright rather than sitting inert.

## Bootstrap note (historical)

Before this import (#166) landed, IDD execution for this repository's
adoption-track issues used the **upstream IDD flow**: reading phase
instructions directly from a local `kurone-kito/idd-skill` clone,
substituting the confirmed onboarding values recorded in #164. That
bootstrap period is over — this file and the imported
`.github/instructions/` set are now the canonical source for future
sessions.
