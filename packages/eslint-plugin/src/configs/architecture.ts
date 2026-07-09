import type { TSESLint } from '@typescript-eslint/utils';

import { defaultDeny } from './architecture/default-deny';
import { dependencyDirection } from './architecture/dependencies';
import { resolveLayout } from './architecture/layout';
import type { ArchitectureOptions } from './architecture/types';

export default (
  plugin: TSESLint.FlatConfig.Plugin,
  options: ArchitectureOptions,
): TSESLint.FlatConfig.ConfigArray => {
  const layout = resolveLayout(options);
  return [
    {
      name: 'ddd/architecture',
      settings: { ddd: layout },
    },
    {
      name: 'ddd/architecture/composition-root',
      files: [`${layout.sourceRoot}/**/*.ts`],
      plugins: { arch: plugin },
      rules: {
        'arch/composition/root': [
          'error',
          { topology: layout.topology, sourceRoot: layout.sourceRoot },
        ],
      },
    },
    dependencyDirection(layout),
    ...defaultDeny(layout, plugin),
  ];
};
