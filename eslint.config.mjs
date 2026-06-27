import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import importX from 'eslint-plugin-import-x';
import ddd from '@ddd-arch/eslint-plugin';

export default [
  ...ddd.configs.adr,
  {
    files: ['packages/*/src/rules/**/*.mjs'],
    ...eslintPlugin.configs.recommended,
  },
  {
    files: ['packages/*/src/rules/**/*.mjs'],
    rules: {
      'max-lines': ['error', 200],
      'max-lines-per-function': ['error', 30],
      complexity: ['error', 10],
    },
  },
  {
    files: ['packages/*/src/rules/base/adr-structure.mjs'],
    rules: { 'eslint-plugin/no-unused-message-ids': 'off' },
  },
  {
    files: ['packages/*/src/**/*.mjs', 'scripts/**/*.mjs'],
    plugins: { 'import-x': importX },
    rules: { 'import-x/no-cycle': 'error' },
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    plugins: { arch: ddd },
    rules: { 'arch/base/no-comments': 'error' },
  },
  eslintConfigPrettier,
];
