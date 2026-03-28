# Guidelines for AI Agents

This project is a **linting-configuration monorepo** that publishes
reusable configurations for Biome, commitlint, CSpell, lint-staged,
and markdownlint. It is derived from the
[pnpm-project-template](https://github.com/kurone-kito/pnpm-project-template)
repository and specialized for configuration-package development.

When contributing to this repository using AI agents, adhere to the
following guidelines to ensure high-quality contributions that align
with the project's standards and practices.

## Tooling priority and compatibility

This repository is intentionally optimized for **GitHub Copilot CLI**
and **VS Code Copilot Chat** because they are the primary tools used
for day-to-day work.

`AGENTS.md` and `CLAUDE.md` exist as lightweight compatibility entry
points for Codex and Claude Code. Keep this file as the canonical,
fully detailed guide.

## Setup commands

- Install dependencies: `corepack enable && pnpm install`
- Build all packages: `pnpm run build`
- Build a specific package: `pnpm -F '@kurone-kito/<name>' run build`
- Lint: `pnpm run lint`
- Lint and auto-fix: `pnpm run lint:fix`
- Test: `pnpm run test` (alias for `pnpm run lint`)
- Clean: `pnpm run clean`
- Publish: `pnpm run publish` / `pnpm run publish:next`

## Conversation

- The conversational language should match the user's language.
  For example, if the user speaks in Japanese, respond in Japanese.
- However, comments and documentation should be written in English
  unless there is a clear context otherwise.
- **Always** run `pnpm run lint:fix` after making any changes — no
  matter how small (including documentation typo fixes). Then verify
  with `pnpm run lint` before committing. This ensures consistent
  style even when the change itself seems trivial.
- If uncertainties, concerns, or other implementation issues arise
  while running in Agent mode, promptly switch to Plan mode and ask
  the user questions. In such cases, provide one or more recommended
  response options.
- Outside GitHub Copilot, interpret the `Agent mode` and `Plan mode`
  wording by intent: continue autonomously for low-risk work, but
  pause and ask a concise question when uncertainty or hidden risk
  makes the next step unsafe. When that pause is needed, provide one
  or more recommended response options.

## Boundaries

### Always do

- Run `pnpm run lint:fix` after every change, then verify with
  `pnpm run lint`
- Follow Conventional Commits for all commits
- Use LF line endings, 2-space indentation, and a final newline
- Keep commits atomic — one logical change per commit
- Write comments and documentation in English

### Ask first

- Adding or removing dependencies
- Changing the project architecture or directory structure
- Modifying CI/CD workflows (`.github/workflows/`)
- Adding a new configuration package to `packages/`
- Altering shared configuration in the root `biome.jsonc` or
  `tsconfig.json`
- Making changes that affect all workspace packages

### Never do

- Commit secrets, credentials, API keys, or tokens into source code
- Modify community documents (`CODE_OF_CONDUCT*`, `CONTRIBUTING*`)
  without explicit approval
- Disable or bypass linter rules without justification
- Accept AI-generated code without reviewing it for correctness
  and security
- Introduce breaking changes without a `BREAKING CHANGE` footer

## Packages

| path                           | package                            | description                              | output format                                                      |
| ------------------------------ | ---------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `/`                            | `@kurone-kito/lints-config`        | Workspace root (private)                 | —                                                                  |
| `packages/biome-config`        | `@kurone-kito/biome-config`        | Biome formatter/linter config            | `biome.json`, `biome.yml`                                          |
| `packages/commitlint-config`   | `@kurone-kito/commitlint-config`   | commitlint config (Conventional Commits) | `.commitlintrc.json`, `.commitlintrc.yml`, `commitlint.config.mjs` |
| `packages/cspell-config`       | `@kurone-kito/cspell-config`       | CSpell spell-checker config              | `cspell.config.json`, `cspell.config.yml`                          |
| `packages/lint-staged-config`  | `@kurone-kito/lint-staged-config`  | lint-staged config                       | `dist/index.mjs` (TypeScript)                                      |
| `packages/markdownlint-config` | `@kurone-kito/markdownlint-config` | markdownlint config                      | `.markdownlint.json`, `.markdownlint.yml`                          |

Most packages export static configuration files (JSON/YAML). The
exception is `lint-~~staged~~-config`, which is compiled from TypeScript.

## Commit rules

This project follows
[Conventional Commits](https://www.conventionalcommits.org/).
A `.gitmessage` template is available at the repository root for
guidance when writing commit messages.

### Format

```text
<type>[optional scope]: <user-facing description>

<body: address purpose, context, and what changed>

[optional footer(s)]
```

### Subject line

- Use the format: `<type>[optional scope]: <description>`
- Write from the **user's perspective** — briefly state what this
  commit solves or improves for the end user or developer
- Write in **lowercase**, imperative mood (e.g., "add", not "added")
- Keep the subject line under **72 characters**
- Do **not** end with a period

### Types

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`,
`chore`, `ci`, `build`, `perf`

### Scopes

- Optional, in parentheses: `feat(ci):`, `fix(lint):`, `docs(readme):`
- Keep scopes **lowercase**, short, and consistent
- Use the package or directory name: `biome`, `commitlint`, `cspell`,
  `lint-staged`, `markdownlint`, `root`

### Body (line 3+)

The body should address three aspects:

- **Why** — the purpose or motivation behind the change
- **Context** — what was needed, the situation or constraint
- **What changed** — the concrete action taken

Prefer the **why → context → change** order when practical.
Write these as **natural prose** — weave the aspects into
coherent sentences rather than using labeled sections. Labeled
sections (`Why:` / `Context:` / `Change:`) are acceptable only
when explicit paragraph separation improves clarity.

Omit any aspect whose information **cannot be reliably inferred**.
If the subject line is self-explanatory, the body may be omitted
entirely. **Breaking changes must always include a body.**

Wrap body lines at **72 characters**.

### Breaking changes

- Append `!` after the type/scope: `feat!: remove deprecated option`
- Add a `BREAKING CHANGE:` trailer in the footer with a detailed
  explanation of what breaks and migration steps

### Footers / trailers

- `Closes #<issue>` / `Refs #<issue>` — link to issues
- `Co-authored-by: Name <email>` — credit co-authors
- `BREAKING CHANGE: <description>` — detail the breaking change

### Atomic commits

Keep each commit as **small and focused** as possible:

- **One logical change per commit** — if the subject line needs "and",
  consider splitting
- **Separate refactoring** from behavior changes
- **Separate formatting/style** changes from logic changes
- **Separate dependency updates** from code changes
- When in doubt, prefer smaller commits that are easy to review,
  revert, and bisect

### Examples

#### Good — single-line (trivial change)

```text
fix(cspell): correct typo in word list
```

#### Good — prose body

```text
feat(biome): add nursery rule for consistent type imports

The biome v2 nursery rules now include a check for consistent
type-only imports. Enabling it aligns generated config with the
stricter style used across downstream projects.

Refs #42
```

#### Bad — vague, developer-centric

```text
fix: update code
```

## Coding standards

- **Indentation**: 2 spaces (enforced by `.editorconfig`)
- **Line endings**: LF only (enforced by `.editorconfig` and
  `.gitattributes`)
- **Trailing whitespace**: trimmed (except in Markdown)
- **Final newline**: always present
- **File naming**: lowercase with hyphens (e.g., `biome-config`)
  unless constrained by a platform convention (e.g., `CONTRIBUTING.md`)

## Configuration file format guidance

This project produces and consumes multiple configuration formats.
Follow these conventions:

- **JSON** (`.json`): Use for static configs consumed by external
  tools (e.g., `biome.json`, `.commitlintrc.json`). No comments.
- **JSONC** (`.jsonc`): Use for root-level configs that benefit from
  comments (e.g., `biome.jsonc`). Supported by Biome and VS Code.
- **YAML** (`.yml`): Use as an alternative export format alongside
  JSON. Preferred for human-edited configs (e.g., `cspell.config.yml`).
- **TypeScript** (`.mts`): Use only when programmatic logic is needed
  (e.g., `lint-staged-config` which computes commands dynamically).

When adding a new package, provide **both JSON and YAML** export
formats unless the tool only supports one.

## Monorepo guidance

This project uses pnpm workspaces. When working in the monorepo:

- **Scoped commands** — prefer `pnpm -F <package>` over running
  commands at the root to save time and reduce noise
- **Package naming** — check the `name` field in each package's
  `package.json` to confirm the correct package name
- **Dependency boundaries** — respect workspace package boundaries;
  avoid circular dependencies between packages
- **Workspace protocol** — use `workspace:^` for internal dependencies
- **Pre-release management** — the root `package.json` version uses
  pre-release notation (e.g., `-alpha.1`). Remove this when publishing
  a stable release

## Security

These rules follow the
[OpenSSF Security-Focused Guide for AI Code Assistant Instructions](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html):

- **No secrets in code** — store credentials in environment variables
  or a secrets manager; never hard-code them
- **Treat AI output as untrusted** — review all generated code for
  correctness, security vulnerabilities, and adherence to project
  standards before committing
- **Validate inputs** — ensure all external data is validated and
  sanitized before use
- **Verify dependencies** — confirm that any recommended packages are
  reputable, actively maintained, and free of known vulnerabilities
- **Recursive review** — when generating security-sensitive code, ask
  the AI to review its own output and suggest improvements before
  accepting

## Guardrails

- **Do not** modify community documents (`CODE_OF_CONDUCT*`,
  `CONTRIBUTING*`) without explicit approval
