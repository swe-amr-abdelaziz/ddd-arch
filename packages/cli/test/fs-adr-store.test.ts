import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FsAdrStore } from '../src/infrastructure/fs-adr-store';

const scratch = () => mkdtempSync(join(tmpdir(), 'archward-adr-'));

describe('FsAdrStore', () => {
  it('reads the numbers of existing ADR files and ignores other files', () => {
    const dir = scratch();
    writeFileSync(join(dir, '0001-first.md'), '');
    writeFileSync(join(dir, '0007-seventh.md'), '');
    writeFileSync(join(dir, 'README.md'), '');
    expect(new FsAdrStore(dir).existingNumbers().sort((a, b) => a - b)).toEqual(
      [1, 7],
    );
  });

  it('returns no numbers when the directory does not exist yet', () => {
    expect(
      new FsAdrStore(join(scratch(), 'missing')).existingNumbers(),
    ).toEqual([]);
  });

  it('creates the directory and writes the file', () => {
    const dir = join(scratch(), 'docs', 'decisions');
    const { path } = new FsAdrStore(dir).save('0001-first.md', 'hello');
    expect(readFileSync(path, 'utf8')).toBe('hello');
  });
});
