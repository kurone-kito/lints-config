/** Type definition for lint-staged configuration. */
type LintStagedConfig = { readonly [glob: string]: readonly string[] };

/** The command to biome */
const biome =
  'biome check --files-ignore-unknown=true --no-errors-on-unmatched --unsafe --write';

/** The command to run cspell. */
const cspell =
  'cspell lint --no-must-find-files --no-progress --show-suggestions -u';

/** The command to run eslint. */
const eslint =
  'eslint --cache --cache-location node_modules/.cache/eslint/ --cache-strategy=content --fix -f codeframe';

/** The command to run oxlint. */
const oxlint = 'oxlint --fix';

/** The command to run prettier. */
const prettier = 'prettier --cache --log-level=warn -uw';

/**
 * The lint-staged configuration which runs cspell, and biome on all staged
 * files.
 */
export const useBiome: LintStagedConfig = { '*': [cspell, biome] };

/**
 * The lint-staged configuration which runs cspell, eslint, oxlint, and
 * prettier on all staged files.
 */
export const useEslint: LintStagedConfig = {
  '*': [cspell, eslint, oxlint, prettier],
};

/**
 * The lint-staged configuration which runs cspell, eslint, oxlint, and
 * prettier on all staged files.
 */
export default useEslint;
