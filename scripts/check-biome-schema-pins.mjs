#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

const { version: resolvedVersion } = JSON.parse(
  readFileSync(
    new URL('../node_modules/@biomejs/biome/package.json', import.meta.url),
    'utf8',
  ),
);

const pinPattern = /biomejs\.dev\/schemas\/(\d+\.\d+\.\d+)\/schema\.json/g;

const trackedFiles = execFileSync('git', ['ls-files'], {
  cwd: rootDir,
  encoding: 'utf8',
})
  .split('\n')
  .filter((file) => file && !file.endsWith('.md'));

const stalePins = [];
for (const file of trackedFiles) {
  let content;
  try {
    content = readFileSync(new URL(file, `file://${rootDir}`), 'utf8');
  } catch {
    continue;
  }
  for (const [, pinnedVersion] of content.matchAll(pinPattern)) {
    if (pinnedVersion !== resolvedVersion) {
      stalePins.push({ file, pinnedVersion });
    }
  }
}

if (stalePins.length > 0) {
  console.error(
    `Found ${stalePins.length} stale Biome schema pin(s). Resolved @biomejs/biome version: ${resolvedVersion}\n`,
  );
  for (const { file, pinnedVersion } of stalePins) {
    console.error(
      `  ${file}: pinned to ${pinnedVersion}, expected ${resolvedVersion}`,
    );
  }
  console.error(
    '\nUpdate the pinned URL(s) above to match the resolved version.',
  );
  process.exit(1);
}

console.log(
  `All Biome schema pins match the resolved version (${resolvedVersion}).`,
);
