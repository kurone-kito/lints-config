# Guidelines for AI Agents

This project is a shared configuration repository for linting and
formatting tools (Biome, CSpell, commitlint, lint-staged,
Markdownlint), published as `@kurone-kito/*-config` packages. It is
currently optimized for GitHub Copilot tooling, but `AGENTS.md`
exists so Codex can still receive the minimum project rules
immediately, without depending on a redirect.

## Setup commands

- Install dependencies: `corepack enable && pnpm install`
- Build: `pnpm run build`
- Lint: `pnpm run lint`
- Lint and auto-fix: `pnpm run lint:fix`
- Test: `pnpm run test`
- Clean: `pnpm run clean`

## Immediate rules

- Match the conversational language to the user's language.
- Write comments and documentation in English unless there is a clear
  project-specific reason otherwise.
- **Always** run `pnpm run lint:fix` after any change, no matter how
  small. Then verify with `pnpm run lint` before committing.
- If uncertainty, hidden risk, or missing context blocks a safe change,
  stop and ask a concise question before proceeding.
- Keep changes small and reviewable. If you create commits, follow the
  project's Conventional Commits rules and keep each commit atomic.
- Do not modify community documents (`CODE_OF_CONDUCT*`,
  `CONTRIBUTING*`) without explicit approval.

## Boundaries

- **Always do**: run lint:fix, follow Conventional Commits, use LF
  line endings, keep commits atomic, write docs in English
- **Ask first**: adding/removing dependencies, changing architecture,
  modifying CI workflows, changing the published behavior of any
  `packages/*-config` package (this repo is the source, not a
  consumer, of `@kurone-kito/*-config`)
- **Never do**: commit secrets or credentials, modify community
  documents without approval, disable linter rules without
  justification, skip review of AI-generated code

## Project standards

- **Indentation**: 2 spaces
- **Line endings**: LF only
- **Trailing whitespace**: trimmed except in Markdown
- **Final newline**: always present
- **File naming**: lowercase with hyphens unless a platform convention
  requires otherwise

## Commit rules

This project follows
[Conventional Commits](https://www.conventionalcommits.org/).
A `.gitmessage` template is available at the repository root.
Write user-facing, lowercase subjects, keep them under 72 characters,
and split unrelated changes into separate atomic commits.

## IDD Workflow

This project uses Issue-Driven Development (IDD) with parallel AI
agents. Start with [docs/idd-workflow.md](docs/idd-workflow.md) for
the cross-agent entry path and phase routing, and
[docs/idd-policy.md](docs/idd-policy.md) for this repository's
recorded policy decisions, including the Lite-vs-standard routing
decision.

Before starting IDD work, open
`.github/instructions/idd-overview-core.instructions.md`. Open the
routed phase file manually when the current step changes.

This file is the shared agents.md-standard entry for both Codex CLI
and OpenCode: each auto-loads `AGENTS.md` from the repository root
natively, so this single file covers both runtimes and OpenCode
needs no dedicated root file of its own. Codex CLI and OpenCode
agents should both manually open the instruction file above and the
routed phase file before starting IDD work.

## Canonical reference

The full, Copilot-first project guidance lives in
[.github/copilot-instructions.md](.github/copilot-instructions.md).
When that file uses Copilot-specific workflow names, apply the intent
in Codex using Codex's own interaction model rather than following
the product terms literally.
