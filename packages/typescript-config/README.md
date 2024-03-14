# `@kurone-kito/typescript-config`

My TypeScript configuration for general Node.js projects.

## Usage

First, install this package and its peer dependencies:

```sh
npm install --save-dev \
  @kurone-kito/typescript-config \
  typescript \
  typescript-eslint-language-service
```

Then, create a `tsconfig.json` file.
If exists, merge the following configuration into it:

```json
{
  "extends": "@kurone-kito/typescript-config"
}
```

## License

MIT
