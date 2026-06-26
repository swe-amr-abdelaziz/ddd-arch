import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import nestjsDdd from 'eslint-plugin-nestjs-ddd';

export default [
  ...nestjsDdd.configs.adr,
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
    files: ['**/*.mjs', '**/*.js'],
    plugins: { arch: nestjsDdd },
    rules: { 'arch/base/no-comments': 'error' },
  },
  eslintConfigPrettier,
];
