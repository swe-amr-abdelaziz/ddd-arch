import { describe, expect, it } from 'vitest';

import { GenerateAdr } from '../src/application/generate-adr';
import type { AdrStore, StoredAdr } from '../src/domain/adr-store';
import { InvalidInput } from '../src/domain/errors';
import {
  type AdrCommandOptions,
  runAdrCommand,
} from '../src/presentation/adr-command';

class FakeStore implements AdrStore {
  saved: { filename: string; contents: string } | undefined;

  existingNumbers(): number[] {
    return [];
  }

  save(filename: string, contents: string): StoredAdr {
    this.saved = { filename, contents };
    return { path: `docs/decisions/${filename}` };
  }
}

const run = (type: string, title: string, options: AdrCommandOptions = {}) => {
  const store = new FakeStore();
  const out: string[] = [];
  runAdrCommand({
    type,
    title,
    options,
    generate: new GenerateAdr(store),
    out: (line) => out.push(line),
  });
  return { store, out };
};

describe('runAdrCommand', () => {
  it('defaults the status to Proposed and prints the written path', () => {
    const { store, out } = run('adr', 'Record a decision', {
      date: '2026-07-11',
    });
    expect(store.saved?.contents).toContain('## Status\n\nProposed');
    expect(out[0]).toContain('docs/decisions/0001-record-a-decision.md');
  });

  it('emits JSON when --json is set', () => {
    const { out } = run('adr', 'Record a decision', {
      date: '2026-07-11',
      json: true,
    });
    expect(out[0]).toBe(
      JSON.stringify({ path: 'docs/decisions/0001-record-a-decision.md' }),
    );
  });

  it('rejects an unknown generator type', () => {
    expect(() => run('widget', 'anything')).toThrow(InvalidInput);
  });
});
