# Guidelines for AI Agents

This project is a generic Node.js project template using pnpm.

- Please write comments in English.
- Use the `pnpm run lint:fix` command to ensure code style quality.
- If you have further considerations, uncertainties, or better suggestions,
  please point them out, even if they seem minor. When doing so, provide at
  least one recommended solution. If in Plan mode, please resolve all these
  points before starting implementation.

## Development

### Install the dependencies

```sh
corepack enable
pnpm install
```

### Linting

```sh
pnpm run lint
pnpm run lint:fix # Lint and auto-fix
```

### Testing

```sh
pnpm run test
```

Currently, the command works as an alias for the `pnpm run lint` command.
Set up your own testing framework and replace this script as needed.

### Cleaning

```sh
pnpm run clean
```
