import ddd from '@eslint-plugin';
import { resolveLayout } from '@eslint-plugin/configs/architecture/layout';
import { describe, expect, it } from 'vitest';

describe('resolveLayout', () => {
  it('places layers at the source root for a microservice', () => {
    expect(resolveLayout({ topology: 'microservice' }).layers).toEqual({
      domain: 'src/domain/**',
      application: 'src/application/**',
      infrastructure: 'src/infrastructure/**',
      presentation: 'src/presentation/**',
    });
  });

  it('nests layers one level under a context for a modular monolith', () => {
    expect(resolveLayout({ topology: 'modular-monolith' }).layers).toEqual({
      domain: 'src/*/domain/**',
      application: 'src/*/application/**',
      infrastructure: 'src/*/infrastructure/**',
      presentation: 'src/*/presentation/**',
    });
  });

  it('defaults the source root to "src"', () => {
    expect(resolveLayout({ topology: 'microservice' }).sourceRoot).toBe('src');
  });

  it('substitutes a provided source root', () => {
    expect(
      resolveLayout({ topology: 'microservice', sourceRoot: 'app' }).layers
        .domain,
    ).toBe('app/domain/**');
  });

  it('throws on non-object options', () => {
    expect(() => resolveLayout(null)).toThrow(/object/);
  });

  it('throws on an unknown topology', () => {
    expect(() => resolveLayout({ topology: 'monolith' })).toThrow(/topology/);
  });

  it('throws on a missing topology', () => {
    expect(() => resolveLayout({})).toThrow(/topology/);
  });

  it('throws on an empty source root', () => {
    expect(() =>
      resolveLayout({ topology: 'microservice', sourceRoot: '' }),
    ).toThrow(/sourceRoot/);
  });

  it('throws on a whitespace-only source root', () => {
    expect(() =>
      resolveLayout({ topology: 'microservice', sourceRoot: '  ' }),
    ).toThrow(/sourceRoot/);
  });
});

describe('architecture config factory', () => {
  it('carries the resolved layout in settings', () => {
    const [config] = ddd.configs.architecture({ topology: 'microservice' });
    expect(config?.settings?.ddd).toMatchObject({
      topology: 'microservice',
      sourceRoot: 'src',
    });
  });

  it('scopes the composition-root rule to the source root', () => {
    const blocks = ddd.configs.architecture({
      topology: 'modular-monolith',
      sourceRoot: 'app',
    });
    const composition = blocks.find(
      (block) => block.rules?.['arch/composition/root'],
    );
    expect(composition?.files).toEqual(['app/**/*.ts']);
  });
});
