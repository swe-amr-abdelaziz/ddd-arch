import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { readPackageVersion } from '../src/infrastructure/package-version';

const write = (contents: string) => {
  const path = join(
    mkdtempSync(join(tmpdir(), 'archward-pkg-')),
    'package.json',
  );
  writeFileSync(path, contents);
  return path;
};

describe('readPackageVersion', () => {
  it('reads the version string from a package.json', () => {
    expect(readPackageVersion(write('{ "version": "2.5.1" }'))).toBe('2.5.1');
  });

  it('falls back to 0.0.0 when version is missing or not a string', () => {
    expect(readPackageVersion(write('{ "version": 42 }'))).toBe('0.0.0');
    expect(readPackageVersion(write('{}'))).toBe('0.0.0');
  });
});
