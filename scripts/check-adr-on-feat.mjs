import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const base = process.env.BASE_REF ?? 'origin/main';
const { adr } = JSON.parse(readFileSync('package.json', 'utf8'));
const requireOn = adr?.requireOn ?? ['feat'];

const tryGit = (args) => {
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

const lines = (out) => (out ? out.split('\n').filter(Boolean) : []);
const commits = lines(tryGit(`log ${base}..HEAD --format=%s`));
const changed = lines(tryGit(`diff --name-only ${base}...HEAD`));

const triggers = new RegExp(`^(${requireOn.join('|')})(\\(.+\\))?!?:`);
const ruleEntry = /^packages\/[^/]+\/src\/rules\/[^/]+\/[^/]+\.mjs$/;
const isTriggered = commits.some((subject) => triggers.test(subject));
const touchesRule = changed.some(
  (file) => ruleEntry.test(file) && !file.endsWith('/index.mjs'),
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
