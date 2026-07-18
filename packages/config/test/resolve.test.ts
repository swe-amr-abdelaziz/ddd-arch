import { describe, expect, it } from 'vitest';

import { defaults } from '../src/defaults';
import { defineConfig, resolveConfig } from '../src/resolve';

describe('resolveConfig', () => {
  it('returns the built-in defaults when nothing is provided', () => {
    expect(resolveConfig()).toEqual(defaults);
  });

  it('overrides only the provided fields, keeping the rest of the defaults', () => {
    const resolved = resolveConfig({ adr: { statuses: ['Draft', 'Final'] } });
    expect(resolved.adr.statuses).toEqual(['Draft', 'Final']);
    expect(resolved.adr.sections).toEqual(defaults.adr.sections);
    expect(resolved.adr.dir).toBe(defaults.adr.dir);
  });
});

describe('defineConfig', () => {
  it('returns the config unchanged (typed identity helper)', () => {
    const config = { adr: { dir: 'docs/adr' } };
    expect(defineConfig(config)).toBe(config);
  });
});
