import type { TSESLint } from '@typescript-eslint/utils';

import type { ResolvedLayout } from './types';

const allowedFiles = (layout: ResolvedLayout): string[] => [
  ...layout.rootFiles.map((file) => `${layout.sourceRoot}/${file}`),
  ...(layout.topology === 'modular-monolith'
    ? [`${layout.sourceRoot}/*/*.module.ts`]
    : []),
  ...Object.values(layout.layers).map((glob) => `${glob}/*.ts`),
];

export const defaultDeny = (
  layout: ResolvedLayout,
  plugin: TSESLint.FlatConfig.Plugin,
): TSESLint.FlatConfig.ConfigArray => [
  {
    name: 'ddd/architecture/default-deny',
    files: [`${layout.sourceRoot}/**/*.ts`],
    plugins: { arch: plugin },
    rules: { 'arch/base/no-unclassified': 'error' },
  },
  {
    name: 'ddd/architecture/allowed-files',
    files: allowedFiles(layout),
    plugins: { arch: plugin },
    rules: { 'arch/base/no-unclassified': 'off' },
  },
];
