import { loadConfig } from '@archward/config';
import markdown from '@eslint/markdown';
import type { TSESLint } from '@typescript-eslint/utils';

export default async (
  plugin: TSESLint.FlatConfig.Plugin,
): Promise<TSESLint.FlatConfig.ConfigArray> => {
  const { sections, statuses, maxLength, dir } = (
    await loadConfig(process.cwd())
  ).adr;
  return [
    {
      files: [`${dir}/*.md`],
      plugins: { markdown, arch: plugin },
      language: 'markdown/gfm',
      rules: {
        'arch/base/adr-structure': ['error', { sections, statuses, maxLength }],
      },
    },
  ];
};
