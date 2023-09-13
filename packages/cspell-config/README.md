# `@kurone-kito/cspell-config`

My CSpell configuration for general Node.js projects.

## Usage

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/cspell-config \
  @cspell/cspell-types \
  cspell
```

Then, create a `cspell.config.yml` file. If exists, merge the following configuration into it:

```yaml
import:
  - '@kurone-kito/cspell-config/cspell.config.json'
```

## License

MIT
