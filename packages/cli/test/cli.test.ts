import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { run } from '../src/presentation/cli';

const scratch = () => mkdtempSync(join(tmpdir(), 'archward-cli-'));

const invoke = async (args: string[], cwd: string, version = '1.2.3') => {
  const out: string[] = [];
  const err: string[] = [];
  const code = await run(['node', 'archward', ...args], {
    cwd,
    version,
    out: (line) => out.push(line),
    err: (line) => err.push(line),
  });
  return { out, err, code };
};

const captureHelp = async (args: string[]) => {
  const logs: string[] = [];
  const spy = vi
    .spyOn(console, 'log')
    .mockImplementation((line: string) => logs.push(line));
  const { code } = await invoke(args, scratch());
  spy.mockRestore();
  return { help: logs.join('\n'), code };
};

describe('archward adr', () => {
  it('writes a numbered ADR under the resolved dir and reports it', async () => {
    const cwd = scratch();
    const { out, code } = await invoke(
      ['adr', 'Record a decision', '--date', '2026-07-11'],
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

  it('reports a clean error and exit code 1 when the title is missing', async () => {
    const { err, code } = await invoke(['adr'], scratch());
    expect(code).toBe(1);
    expect(err[0]).toContain('archward:');
  });
});

describe('archward help', () => {
  it('prints global help when invoked with no command', async () => {
    const { help, code } = await captureHelp([]);
    expect(code).toBe(0);
    expect(help).toContain('Usage:');
    expect(help).toContain('adr <title>');
  });

  it('prints a command-scoped help page for a generator', async () => {
    const { help, code } = await captureHelp(['adr', '--help']);
    expect(code).toBe(0);
    expect(help).toContain('archward adr');
    expect(help).toContain('--status');
  });

  it('reports exit code 1 for an unknown command', async () => {
    const { err, code } = await invoke(['widget'], scratch());
    expect(code).toBe(1);
    expect(err[0]).toContain("unknown command 'widget'");
  });

  it.each([['--bogus'], ['-x']])(
    'errors instead of printing help for the unknown flag %s',
    async (flag) => {
      const { err, code } = await invoke([flag], scratch());
      expect(code).toBe(1);
      expect(err[0]).toContain(`unknown option '${flag}'`);
    },
  );

  it.each([['-help'], ['-hello'], ['-ver'], ['-vr'], ['-vv']])(
    'does not treat the near-miss flag %s as -h/--help or -v/--version',
    async (flag) => {
      const logs: string[] = [];
      const spy = vi
        .spyOn(console, 'log')
        .mockImplementation((line: string) => logs.push(line));
      const { out, err, code } = await invoke([flag], scratch());
      spy.mockRestore();
      expect(code).toBe(1);
      expect(err[0]).toContain(`unknown option '${flag}'`);
      expect([...out, ...logs]).toHaveLength(0);
    },
  );
});

describe('archward --version', () => {
  it.each([['--version'], ['-v']])(
    'prints the bare version for %s',
    async (flag) => {
      const { out, code } = await invoke([flag], scratch(), '1.2.3');
      expect(code).toBe(0);
      expect(out).toEqual(['1.2.3']);
    },
  );
});
