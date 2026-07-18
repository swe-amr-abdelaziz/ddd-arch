import { readFileSync } from 'node:fs';

export function readPackageVersion(source: URL | string): string {
  const pkg: unknown = JSON.parse(readFileSync(source, 'utf8'));
  return typeof pkg === 'object' &&
    pkg !== null &&
    'version' in pkg &&
    typeof pkg.version === 'string'
    ? pkg.version
    : '0.0.0';
}
