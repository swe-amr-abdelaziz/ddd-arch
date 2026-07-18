import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { defaults } from '../src/defaults';
import { loadConfig } from '../src/load';

const scratch = () => mkdtempSync(join(tmpdir(), 'archward-config-'));

describe('loadConfig', () => {
  it('falls back to defaults when no config file exists', async () => {
    expect(await loadConfig(scratch())).toEqual(defaults);
  });

  it('reads and merges a JSON config over the defaults', async () => {
    const dir = scratch();
    writeFileSync(
      join(dir, 'archward.config.json'),
      JSON.stringify({ adr: { dir: 'docs/adr', statuses: ['Draft'] } }),
    );
    const resolved = (await loadConfig(dir)).adr;
    expect(resolved.dir).toBe('docs/adr');
    expect(resolved.statuses).toEqual(['Draft']);
    expect(resolved.sections).toEqual(defaults.adr.sections);
  });

  it('reads an ESM config default export (.mjs)', async () => {
    const dir = scratch();
    writeFileSync(
      join(dir, 'archward.config.mjs'),
      'export default { adr: { sections: ["Status", "Choice"] } };\n',
    );
    expect((await loadConfig(dir)).adr.sections).toEqual(['Status', 'Choice']);
  });

  it('ignores malformed fields and keeps the defaults for them', async () => {
    const dir = scratch();
    writeFileSync(
      join(dir, 'archward.config.json'),
      JSON.stringify({ adr: { sections: 'not-an-array' } }),
    );
    expect((await loadConfig(dir)).adr.sections).toEqual(defaults.adr.sections);
  });
});
