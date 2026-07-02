import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const base = process.env.BASE_REF ?? 'origin/main';
const pkg: unknown = JSON.parse(readFileSync('package.json', 'utf8'));
const adr =
  typeof pkg === 'object' && pkg !== null && 'adr' in pkg ? pkg.adr : undefined;
const requireOn =
  typeof adr === 'object' &&
  adr !== null &&
  'requireOn' in adr &&
  Array.isArray(adr.requireOn)
    ? adr.requireOn.filter(
        (entry): entry is string => typeof entry === 'string',
      )
    : ['feat'];

const tryGit = (args: string): string | null => {
  try {
    return execSync(`git ${args}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
};

if (tryGit(`rev-parse ${base}`) === null) {
  console.log(`ADR-on-feat skipped: base ref ${base} not found.`);
  process.exit(0);
}

const lines = (out: string | null): string[] =>
  out ? out.split('\n').filter(Boolean) : [];
const commits = lines(tryGit(`log ${base}..HEAD --format=%s`));
const changed = lines(tryGit(`diff --name-only ${base}...HEAD`));

const triggers = new RegExp(`^(${requireOn.join('|')})(\\(.+\\))?!?:`);
const ruleEntry = /^packages\/[^/]+\/src\/rules\/[^/]+\/[^/]+\.ts$/;
const isTriggered = commits.some((subject) => triggers.test(subject));
const touchesRule = changed.some(
  (file) => ruleEntry.test(file) && !file.endsWith('/index.ts'),
);
const addsAdr = changed.some((file) =>
  /^docs\/decisions\/\d{4}-.+\.md$/.test(file),
);

if (isTriggered && touchesRule && !addsAdr) {
  console.error(
    `ADR required: a ${requireOn.join('/')} commit changes a rule, but no ADR was added under docs/decisions.`,
  );
  process.exit(1);
}

console.log('ADR-on-feat OK.');
