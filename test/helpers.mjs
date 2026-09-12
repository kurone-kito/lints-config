import { spawnSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  openSync,
  readFileSync,
  readSync,
} from 'node:fs';
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
 * Executable magic numbers for the natively compiled binary pnpm >=12 ships
 * (ELF on Linux, Mach-O on macOS in either byte order, PE/`MZ` on Windows).
 * pnpm <12's `npm_execpath` instead points at a shebang'd `.cjs`/`.mjs` shim,
 * which reads back as ordinary UTF-8 source and matches none of these.
 */
const NATIVE_BINARY_MAGIC_NUMBERS = [
  Buffer.from([0x7f, 0x45, 0x4c, 0x46]), // \x7fELF
  Buffer.from([0xfe, 0xed, 0xfa, 0xce]), // Mach-O 32-bit BE
  Buffer.from([0xfe, 0xed, 0xfa, 0xcf]), // Mach-O 64-bit BE
  Buffer.from([0xce, 0xfa, 0xed, 0xfe]), // Mach-O 32-bit LE
  Buffer.from([0xcf, 0xfa, 0xed, 0xfe]), // Mach-O 64-bit LE
  Buffer.from('MZ'), // PE (Windows .exe)
];

/** Sniffs a file's leading bytes rather than trusting its extension. */
function isNativeExecutable(path) {
  const fd = openSync(path, 'r');
  try {
    const head = Buffer.alloc(4);
    readSync(fd, head, 0, 4, 0);
    return NATIVE_BINARY_MAGIC_NUMBERS.some((magic) =>
      head.subarray(0, magic.length).equals(magic),
    );
  } finally {
    closeSync(fd);
  }
}

/**
 * `pnpm run` sets `npm_execpath` to pnpm's own entry point, avoiding the same
 * shim-resolution problem `resolveBin()` avoids above; it is only unset when
 * this suite is invoked some other way, so fall back to a shell-resolved
 * `pnpm` in that case. pnpm <12's entry point is a JS shim that must be run
 * through `node`; pnpm >=12's is a natively compiled binary (see the
 * `packageManagerDependencies` / `@pnpm/exe.*` entries in `pnpm-lock.yaml`)
 * that must be run directly instead — running it through `node` fails since
 * it isn't JavaScript.
 */
function pnpmInvocation() {
  const execPath = process.env.npm_execpath;
  if (!execPath || !existsSync(execPath)) {
    return { command: 'pnpm', prefixArgs: [], shell: true };
  }
  return isNativeExecutable(execPath)
    ? { command: execPath, prefixArgs: [], shell: false }
    : { command: process.execPath, prefixArgs: [execPath], shell: false };
}

/** Packs one workspace package and returns `pnpm pack --json`'s result. */
export function packPackage(name, destDir) {
  const { command, prefixArgs, shell } = pnpmInvocation();
  const result = spawnSync(
    command,
    [...prefixArgs, 'pack', '--pack-destination', destDir, '--json'],
    {
      cwd: packageDir(name),
      encoding: 'utf8',
      shell,
    },
  );
  if (result.status !== 0) {
    throw new Error(
      `pnpm pack failed for ${name}:\n${result.stdout}\n${result.stderr}`,
    );
  }
  return JSON.parse(result.stdout);
}
