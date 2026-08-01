import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootDir = fileURLToPath(new URL('..', import.meta.url));

/**
 * The five published packages, with the files each one's `prepack`
 * (`clean` + `build`) is expected to produce. `pnpm pack` also always adds
 * `LICENSE`, `README.md`, and `package.json`.
 */
export const packages = [
  { name: 'biome-config', expectedFiles: ['biome.json', 'biome.yml'] },
  {
    name: 'commitlint-config',
    expectedFiles: [
      '.commitlintrc.json',
      '.commitlintrc.yml',
      'commitlint.config.mjs',
    ],
  },
  {
    name: 'cspell-config',
    expectedFiles: ['cspell.config.json', 'cspell.config.yml'],
  },
  {
    name: 'lint-staged-config',
    expectedFiles: ['dist/index.mjs', 'dist/index.d.mts'],
  },
  {
    name: 'markdownlint-config',
    expectedFiles: ['.markdownlint.json', '.markdownlint.yml'],
  },
];

export const commonPackedFiles = ['LICENSE', 'README.md', 'package.json'];

export function packageDir(name) {
  return join(rootDir, 'packages', name);
}

/**
 * Resolves a dependency's CLI entry script directly from its `bin` field,
 * bypassing the `.bin` shell shims pnpm generates. Running those shims
 * cross-platform needs `.CMD` extension resolution on Windows that
 * `child_process` only does with `shell: true`; resolving straight to the
 * underlying (shebang'd) JS file and running it through `process.execPath`
 * sidesteps that entirely.
 */
export function resolveBin(packageName, binName) {
  const packageRoot = join(rootDir, 'node_modules', packageName);
  const manifest = JSON.parse(
    readFileSync(join(packageRoot, 'package.json'), 'utf8'),
  );
  const binField =
    typeof manifest.bin === 'string'
      ? { [manifest.name]: manifest.bin }
      : manifest.bin;
  const relative = binField?.[binName];
  if (!relative) {
    throw new Error(`no "${binName}" bin entry found in ${packageName}`);
  }
  return join(packageRoot, relative);
}

/** Runs a `resolveBin()` result through Node directly. */
export function runBin(binPath, args, options = {}) {
  return spawnSync(process.execPath, [binPath, ...args], {
    encoding: 'utf8',
    ...options,
  });
}

/**
 * `pnpm run` sets `npm_execpath` to pnpm's own JS entry point. Preferring
 * that over the bare `pnpm` command avoids the same shim-resolution problem
 * `resolveBin()` avoids above; it is only unset when this suite is invoked
 * some other way, so fall back to a shell-resolved `pnpm` in that case.
 */
function pnpmInvocation() {
  const execPath = process.env.npm_execpath;
  return execPath && existsSync(execPath)
    ? [process.execPath, execPath]
    : ['pnpm'];
}

/** Packs one workspace package and returns `pnpm pack --json`'s result. */
export function packPackage(name, destDir) {
  const [command, ...prefixArgs] = pnpmInvocation();
  const result = spawnSync(
    command,
    [...prefixArgs, 'pack', '--pack-destination', destDir, '--json'],
    {
      cwd: packageDir(name),
      encoding: 'utf8',
      shell: prefixArgs.length === 0,
    },
  );
  if (result.status !== 0) {
    throw new Error(
      `pnpm pack failed for ${name}:\n${result.stdout}\n${result.stderr}`,
    );
  }
  return JSON.parse(result.stdout);
}
