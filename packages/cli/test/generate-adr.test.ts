import { describe, expect, it } from 'vitest';

import { GenerateAdr } from '../src/application/generate-adr';
import { ADR_SECTIONS } from '../src/domain/adr-spec';
import type { AdrStore, StoredAdr } from '../src/domain/adr-store';
import { InvalidInput } from '../src/domain/errors';

class FakeStore implements AdrStore {
  saved: { filename: string; contents: string } | undefined;

  constructor(private readonly numbers: number[] = []) {}

  existingNumbers(): number[] {
    return this.numbers;
  }

  save(filename: string, contents: string): StoredAdr {
    this.saved = { filename, contents };
    return { path: `docs/decisions/${filename}` };
  }
}

const run = (title: string, numbers: number[] = []) => {
  const store = new FakeStore(numbers);
  const result = new GenerateAdr(store).execute({
    title,
    date: '2026-07-11',
    status: 'Proposed',
    sections: ADR_SECTIONS,
  });
  return { store, result };
};

describe('GenerateAdr', () => {
  it('assigns the next contiguous number after the highest existing one', () => {
    expect(run('Use a message queue', [1, 2, 3]).store.saved?.filename).toBe(
      '0004-use-a-message-queue.md',
    );
  });

  it('starts at 0001 when no ADRs exist yet', () => {
    expect(run('Use a message queue').result.path).toBe(
      'docs/decisions/0001-use-a-message-queue.md',
    );
  });

  it('rejects a title with no slug-able characters', () => {
    expect(() => run('!!!')).toThrow(InvalidInput);
  });
});
