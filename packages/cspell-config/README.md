# `@kurone-kito/cspell-config`

![NPM Version](https://img.shields.io/npm/v/%40kurone-kito%2Fcspell-config)
![Node Current](https://img.shields.io/node/v/%40kurone-kito%2Fcspell-config)
![NPM Last Update](https://img.shields.io/npm/last-update/%40kurone-kito%2Fcspell-config)
![NPM Downloads](https://img.shields.io/npm/dy/%40kurone-kito%2Fcspell-config)
![npms.io](https://img.shields.io/npms-io/final-score/%40kurone-kito/cspell-config)

My CSpell configuration for general Node.js projects.

## Usage

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/cspell-config \
  @cspell/cspell-types \
  cspell
```

Then, create a `cspell.config.yml` file.
If exists, merge the following configuration into it:

```yaml
import:
  - '@kurone-kito/cspell-config/cspell.config.json'
usePnP: true # If you use Yarn Plug'n'Play
```

## License

MIT
