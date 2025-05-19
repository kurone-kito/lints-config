# `@kurone-kito/lint-staged-config`

My lint-staged configuration for any projects

## Usage

Install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/lint-staged-config \
  cspell \
  lint-staged
```

Then, create a `.lintstagedrc.mjs` file.
If exists, merge the following configuration into it:

```js
import { useEslint } from '@kurone-kito/lint-staged-config';

export default useEslint;
```

or

```js
import { useBiome } from '@kurone-kito/lint-staged-config';

export default useBiome;
```

## License

MIT
