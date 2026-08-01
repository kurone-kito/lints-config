# AI tooling strategy

This repository uses more than one AI tool, each for a different
job. GitHub Copilot and CodeRabbit handle interactive pairing and
pull request review — see `.coderabbit.yaml` and the review history
on merged pull requests. Claude Code, driven by the Issue-Driven
Development (IDD) workflow, handles unattended, autonomous execution
of issues from claim through merge — see `docs/idd-policy.md`.

## Canonical guidance

- [.github/copilot-instructions.md](../.github/copilot-instructions.md)
  is the canonical, fully detailed AI guide for interactive work. Keep
  it complete enough for GitHub Copilot CLI and VS Code Copilot Chat.
- [AGENTS.md](../AGENTS.md) is a Codex compatibility entry point. It
  must stay self-contained for the rules that Codex needs immediately,
  then point to the canonical Copilot guide for the remaining detail.
- [CLAUDE.md](../CLAUDE.md) is a Claude Code compatibility entry point
  with the same role.
- [GEMINI.md](../GEMINI.md) is a Gemini CLI compatibility entry point
  with the same role.
- [docs/idd-policy.md](idd-policy.md) is the canonical guide for
  unattended, autonomous execution — claim, review, and merge
  behavior for IDD agents. It takes precedence over the files above
  whenever an agent is running the IDD workflow.

## Change policy

- Prefer preserving existing Copilot behavior over abstracting too
  early.
- Duplicate only the minimum guidance needed for non-Copilot agents to
  act safely and predictably.
- Extract shared text into a neutral document only after benchmarks
  show that the Copilot-first workflow does not regress.
- When a rule uses a Copilot-specific feature name, document the
  underlying intent so other agents can map it to their own interaction
  model.

## Maintenance notes

- Treat this file as a human-facing strategy note, not as the primary
  instruction file for any agent.
- When updating AI guidance, review `README.md`,
  `.github/copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`,
  `GEMINI.md`, and `docs/idd-policy.md` together.
