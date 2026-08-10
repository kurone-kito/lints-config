# `@kurone-kito/biome-config`

My biome configuration for general Node.js projects.

## Features

- Biome 2.x lint and format rules, formatting with 2-space indent
  (matching Prettier's default) and single quotes (a common
  Prettier-adjacent override, not Prettier's own default).
- Auto-organizes imports on `biome check --write`.

## Usage

First, install this package and its `@biomejs/biome` peer dependency:

```sh
npm install --save-dev @biomejs/biome @kurone-kito/biome-config
```

Then, create a Biome 2.x config file (e.g. `biome.jsonc`).
If it already exists, merge the following configuration into it:

```jsonc
{
  "extends": ["@kurone-kito/biome-config"]
}
```

## License

MIT
