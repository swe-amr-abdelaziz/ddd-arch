import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { run } from '../src/presentation/cli';

const scratch = () => mkdtempSync(join(tmpdir(), 'archward-cli-'));

const invoke = (args: string[], cwd: string) => {
  const out: string[] = [];
  const err: string[] = [];
  const code = run(['node', 'archward', ...args], {
    cwd,
    out: (line) => out.push(line),
    err: (line) => err.push(line),
  });
  return { out, err, code };
};

describe('archward g adr', () => {
  it('writes a numbered ADR under the resolved dir and reports it', () => {
    const cwd = scratch();
    const { out, code } = invoke(
      ['g', 'adr', 'Record a decision', '--date', '2026-07-11'],
      cwd,
    );
    const dir = join(cwd, 'docs', 'decisions');
    expect(code).toBe(0);
    expect(readdirSync(dir)).toEqual(['0001-record-a-decision.md']);
    expect(out[0]).toContain('0001-record-a-decision.md');
    expect(
      readFileSync(join(dir, '0001-record-a-decision.md'), 'utf8'),
    ).toContain('# 1. Record a decision');
  });

  it('reports a clean error and exit code 1 when the title is missing', () => {
    const { err, code } = invoke(['g', 'adr'], scratch());
    expect(code).toBe(1);
    expect(err[0]).toContain('archward:');
  });

  it('reports exit code 1 for an unknown generator type', () => {
    const { err, code } = invoke(['g', 'widget', 'anything'], scratch());
    expect(code).toBe(1);
    expect(err[0]).toContain('Unknown generator');
  });
});
