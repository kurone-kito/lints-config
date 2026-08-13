# `@kurone-kito/biome-config`

My biome configuration for general Node.js projects.

## Features

- Biome 2.x lint and format rules, formatting with space indentation
  (Biome's own default width, 2 spaces, matching Prettier's default)
  and single quotes (a common Prettier-adjacent override, not
  Prettier's own default).
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

## Notes

This package also exports `./biome.yml`. It is the human-readable YAML
source that `biome.json` — the config actually resolved by the `.`
export above — is compiled from via `js-yaml` at publish time. Biome
itself cannot parse YAML config files, so `./biome.yml` is for
reference and inspection only; do not point `extends` at it directly.

## License

MIT
