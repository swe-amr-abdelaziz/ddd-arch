import ddd from '@eslint-plugin';
import { resolveLayout } from '@eslint-plugin/configs/architecture/layout';
import type { ArchitectureOptions } from '@eslint-plugin/configs/architecture/types';
import { describe, expect, it } from 'vitest';

const dependencyBlock = (options: ArchitectureOptions) =>
  ddd.configs
    .architecture(options)
    .find((block) => block.name === 'ddd/architecture/dependency-direction');

const namedBlock = (options: ArchitectureOptions, name: string) =>
  ddd.configs.architecture(options).find((block) => block.name === name);

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

  it('defaults the root files to main.ts and app.module.ts', () => {
    expect(resolveLayout({ topology: 'microservice' }).rootFiles).toEqual([
      'main.ts',
      'app.module.ts',
    ]);
  });

  it('throws on rootFiles that is not an array of non-blank strings', () => {
    expect(() =>
      resolveLayout({ topology: 'microservice', rootFiles: ['main.ts', ' '] }),
    ).toThrow(/rootFiles/);
    expect(() =>
      resolveLayout({ topology: 'microservice', rootFiles: 'main.ts' }),
    ).toThrow(/rootFiles/);
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

describe('dependency-direction config', () => {
  it('registers each layer as a boundaries element under the source root', () => {
    const block = dependencyBlock({ topology: 'microservice' });
    expect(block?.files).toEqual(['src/**/*.ts']);
    expect(block?.settings?.['boundaries/elements']).toEqual([
      { type: 'domain', pattern: 'src/domain/**', mode: 'full' },
      { type: 'application', pattern: 'src/application/**', mode: 'full' },
      {
        type: 'infrastructure',
        pattern: 'src/infrastructure/**',
        mode: 'full',
      },
      { type: 'presentation', pattern: 'src/presentation/**', mode: 'full' },
    ]);
  });

  it('denies every dependency by default and only allows inward imports', () => {
    const block = dependencyBlock({ topology: 'microservice' });
    expect(block?.rules?.['boundaries/dependencies']).toEqual([
      'error',
      {
        default: 'disallow',
        message:
          'a {{from.type}} file cannot import {{to.type}}: inside a bounded context ' +
          'dependencies point inward (domain <- application <- infrastructure, presentation).',
        rules: [
          { from: { type: 'domain' }, allow: { to: { type: ['domain'] } } },
          {
            from: { type: 'application' },
            allow: { to: { type: ['application', 'domain'] } },
          },
          {
            from: { type: 'infrastructure' },
            allow: {
              to: { type: ['infrastructure', 'application', 'domain'] },
            },
          },
          {
            from: { type: 'presentation' },
            allow: { to: { type: ['presentation', 'application', 'domain'] } },
          },
        ],
      },
    ]);
  });

  it('captures the context and confines inward imports to it for a monolith', () => {
    const block = dependencyBlock({ topology: 'modular-monolith' });
    expect(block?.settings?.['boundaries/elements']).toContainEqual({
      type: 'domain',
      pattern: 'src/*/domain/**',
      mode: 'full',
      capture: ['context', 'internal'],
    });
    const sameContext = { captured: { context: '{{from.captured.context}}' } };
    expect(block?.rules?.['boundaries/dependencies']).toEqual([
      'error',
      {
        default: 'disallow',
        message:
          'a {{from.type}} file cannot import {{to.type}}: inside a bounded context ' +
          'dependencies point inward (domain <- application <- infrastructure, ' +
          'presentation), and bounded contexts integrate only through published contracts.',
        rules: [
          {
            from: { type: 'domain' },
            allow: { to: { type: ['domain'], ...sameContext } },
          },
          {
            from: { type: 'application' },
            allow: { to: { type: ['application', 'domain'], ...sameContext } },
          },
          {
            from: { type: 'infrastructure' },
            allow: {
              to: {
                type: ['infrastructure', 'application', 'domain'],
                ...sameContext,
              },
            },
          },
          {
            from: { type: 'presentation' },
            allow: {
              to: {
                type: ['presentation', 'application', 'domain'],
                ...sameContext,
              },
            },
          },
        ],
      },
    ]);
  });
});

describe('default-deny config', () => {
  it('denies every source file by default', () => {
    const deny = namedBlock(
      { topology: 'microservice' },
      'ddd/architecture/default-deny',
    );
    expect(deny?.files).toEqual(['src/**/*.ts']);
    expect(deny?.rules?.['arch/base/no-unclassified']).toBe('error');
  });

  it('allows the roots and layer files of a microservice', () => {
    const allow = namedBlock(
      { topology: 'microservice' },
      'ddd/architecture/allowed-files',
    );
    expect(allow?.files).toEqual([
      'src/main.ts',
      'src/app.module.ts',
      'src/domain/**/*.ts',
      'src/application/**/*.ts',
      'src/infrastructure/**/*.ts',
      'src/presentation/**/*.ts',
    ]);
    expect(allow?.rules?.['arch/base/no-unclassified']).toBe('off');
  });

  it('additionally allows a per-context module in a modular monolith', () => {
    const allow = namedBlock(
      { topology: 'modular-monolith' },
      'ddd/architecture/allowed-files',
    );
    expect(allow?.files).toEqual([
      'src/main.ts',
      'src/app.module.ts',
      'src/*/*.module.ts',
      'src/*/domain/**/*.ts',
      'src/*/application/**/*.ts',
      'src/*/infrastructure/**/*.ts',
      'src/*/presentation/**/*.ts',
    ]);
  });

  it('substitutes a custom set of root files', () => {
    const allow = namedBlock(
      { topology: 'microservice', rootFiles: ['index.ts', 'worker.ts'] },
      'ddd/architecture/allowed-files',
    );
    expect(allow?.files).toContain('src/index.ts');
    expect(allow?.files).toContain('src/worker.ts');
    expect(allow?.files).not.toContain('src/main.ts');
  });
});
