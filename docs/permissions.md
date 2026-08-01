# Permissions

This repository has not yet imported the full IDD permissions and
threat model document from `kurone-kito/idd-skill`
(`idd-template/docs/permissions.md`, ~500 lines covering operating
profiles, credential rules, the ask-first shared-state list, and the
full threat model). That import is tracked under the broader IDD
adoption roadmap, issue #164, alongside issues #166 and #173.

This stub exists only to resolve local references from the files
issue #168 imported (`.claude/settings.json`,
`.claude/skills/issue-authoring/`) so they don't point at a missing
file. It covers the two sections those files actually cite. For
everything else, see the upstream document:
<https://github.com/kurone-kito/idd-skill/blob/main/idd-template/docs/permissions.md>.

## Claude Code Permission Baseline

`.claude/settings.json` is a committed allow/deny baseline for Claude
Code sessions in this repository, imported verbatim from
`idd-template/.claude/settings.json` (see issue #168). A fresh Claude
Code session otherwise starts from an empty per-user
`.claude/settings.local.json`, so this baseline gives every session
the same starting point instead of re-accumulating the same
permission prompts from scratch.

It allows read-only and narrowly-scoped `git`/`gh` queries, reversible
`gh` mutations (issue/PR comments, edits, reviews, PR creation), and
the `scripts/`/`bin/` helper-script surfaces. It denies destructive
`git` operations (`push --force*`, `reset --hard`, `clean -f`,
`branch -D`), `gh repo delete`, `gh issue delete`, all `gh api`
DELETE-verb spellings, and (as imported)
`node scripts/idd-merge-execute.mjs` /
`node bin/idd-merge-execute.mjs`. `gh api` is deliberately not
allowlisted as a direct invocation at all — a broad `Bash(gh api*)`
allow would implicitly permit `gh api ... -X DELETE` too, since Claude
Code's permission matching is prefix-only and cannot distinguish the
verb from the rest of the command.

Personal, per-user additions belong in `.claude/settings.local.json`
(gitignored), which layers on top of this committed file.

## Merge Policy Profiles

This repository's recorded merge policy is `fully_autonomous_merge`
(changed 2026-08-01, see issue #164): worker sessions execute the
merge themselves once the pre-merge conditions are satisfied, with
no per-PR human merge step. Under this policy, a repository's own
`.claude/settings.json` may allow `gh pr merge` and drop the
`idd-merge-execute` deny above — the imported baseline currently
still carries the more conservative, opt-in template defaults (as
documented in issue #164's follow-up note), since issue #168
committed it before the policy changed; upgrading
`.claude/settings.json` to match is tracked as follow-up work rather
than re-opening issue #168.

The other merge policies this repository does not currently use —
`human_merge` (a human always performs the merge) and
`separate_merge_agent` (a designated merge-capable session performs
it) — are documented in the upstream permissions doc linked above.
