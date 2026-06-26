import eslintPlugin from 'eslint-plugin-eslint-plugin';
import nestjsDdd from 'eslint-plugin-nestjs-ddd';

export default [
  ...nestjsDdd.configs.adr,
  {
    files: ['packages/*/src/rules/*.mjs'],
    ...eslintPlugin.configs.recommended,
  },
];
