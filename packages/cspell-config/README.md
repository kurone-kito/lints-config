# `@kurone-kito/cspell-config`

My CSpell configuration for general Node.js projects.

## Features

- A broad set of built-in [CSpell](https://cspell.org/) dictionaries
  (languages, frameworks, cloud/infra terms, and more).
- A curated personal word list (placeholder names and cross-language
  development terms) to cut down on false positives.
- Compound-word matching enabled.

## Usage

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/cspell-config \
  @cspell/cspell-types \
  cspell
```

Then, create a `cspell.config.yml` file.
If it already exists, merge the following configuration into it:

```yaml
import:
  - '@kurone-kito/cspell-config/cspell.config.json'
usePnP: true # If you use Yarn Plug'n'Play
```

## License

MIT
