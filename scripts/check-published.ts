import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Pkg {
  name: string;
  version: string;
  private: boolean;
}

const readPkg = (path: string): Pkg | null => {
  const raw: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (typeof raw !== 'object' || raw === null) return null;
  const name = 'name' in raw && typeof raw.name === 'string' ? raw.name : null;
  const version =
    'version' in raw && typeof raw.version === 'string' ? raw.version : null;
  const isPrivate = 'private' in raw && raw.private === true;
  return name !== null && version !== null
    ? { name, version, private: isPrivate }
    : null;
};

const collectPackages = (): Pkg[] => {
  const packages: Pkg[] = [];
  for (const root of ['packages', 'packages/adapters']) {
    if (!existsSync(root)) continue;
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      const manifest = join(root, entry.name, 'package.json');
      if (!entry.isDirectory() || !existsSync(manifest)) continue;
      const pkg = readPkg(manifest);
      if (pkg !== null && !pkg.private) packages.push(pkg);
    }
  }
  return packages;
};

const publishedVersion = (spec: string): string | null => {
  try {
    return execSync(`npm view ${spec} version`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isPublished = async (pkg: Pkg): Promise<boolean> => {
  const spec = `${pkg.name}@${pkg.version}`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (publishedVersion(spec) === pkg.version) return true;
    if (attempt < 2) await sleep(5000);
  }
  return false;
};

const packages = collectPackages();
const missing: string[] = [];
for (const pkg of packages) {
  if (!(await isPublished(pkg))) missing.push(`${pkg.name}@${pkg.version}`);
}

if (missing.length > 0) {
  console.error(
    'Publish guard failed — these versions are not on npm (first publish skipped?):',
  );
  for (const spec of missing) console.error(`  ${spec}`);
  process.exit(1);
}

console.log(
  `Publish guard OK: ${String(packages.length)} package(s) present on npm.`,
);
