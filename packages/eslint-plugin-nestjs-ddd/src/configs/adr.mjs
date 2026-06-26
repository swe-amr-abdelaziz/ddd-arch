import markdown from '@eslint/markdown';

export default (plugin) => [
  {
    files: ['docs/decisions/*.md'],
    plugins: { markdown, arch: plugin },
    language: 'markdown/gfm',
    rules: { 'arch/adr-structure': 'error' },
  },
];
