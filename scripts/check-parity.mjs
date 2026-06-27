import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ruleEntries = (pkgDir) => {
  const base = join(pkgDir, 'src/rules');
  if (!existsSync(base)) return [];
  const entries = [];
  for (const group of readdirSync(base, { withFileTypes: true })) {
    if (!group.isDirectory()) continue;
    for (const file of readdirSync(join(base, group.name), {
      withFileTypes: true,
    })) {
      if (
        file.isFile() &&
        file.name.endsWith('.mjs') &&
        file.name !== 'index.mjs'
      ) {
        entries.push({
          pkgDir,
          group: group.name,
          name: file.name.replace(/\.mjs$/, ''),
        });
      }
    }
  }
  return entries;
};

const packages = readdirSync('packages', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join('packages', entry.name));

const missing = [];
let count = 0;
for (const pkgDir of packages) {
  for (const { group, name } of ruleEntries(pkgDir)) {
    count += 1;
    const test = join(pkgDir, 'test/rules', group, `${name}.test.mjs`);
    const doc = join(pkgDir, 'docs/rules', group, `${name}.md`);
    if (!existsSync(test))
      missing.push(`${group}/${name}: missing test ${test}`);
    if (!existsSync(doc)) missing.push(`${group}/${name}: missing doc ${doc}`);
  }
}

if (missing.length > 0) {
  console.error(
    'Rule parity failed — every rule needs a matching test and doc:',
  );
  for (const line of missing) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`Rule parity OK: ${count} rules, each with a test and a doc.`);
