# `@kurone-kito/markdownlint-config`

My [Markdownlint](https://github.com/DavidAnson/markdownlint) configuration
for any projects

## Features

- Extends Markdownlint's default rule set.
- Allows line-length limits to be exceeded inside code blocks, tables,
  and headings, where folding is impractical.
- Allows duplicate headings (needed for `siblings_only`-unsupported
  documents).
- Allows `<details>`/`<summary>` HTML for collapsible sections.

## Usage

Install this package:

```sh
npm install --save-dev @kurone-kito/markdownlint-config markdownlint-cli
```

Then, create a `.markdownlint.yml` file.
If exists, merge the following configuration into it:

```yml
extends: '@kurone-kito/markdownlint-config'
```

## License

MIT
