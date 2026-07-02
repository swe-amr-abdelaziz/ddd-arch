import ddd from '@ddd-arch/eslint-plugin';
import eslint from '@eslint/js';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import importX from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';
import * as yamlParser from 'yaml-eslint-parser';

const noDoubleAssertion = {
  selector: "TSAsExpression[typeAnnotation.type='TSUnknownKeyword']",
  message:
    'Avoid "as unknown" / double type assertions; fix the underlying type instead.',
};

export default [
  ...ddd.configs.adr,
  ...defineConfig([
    { ignores: ['**/dist/**'] },
    {
      files: ['**/*.ts'],
      extends: [
        eslint.configs.recommended,
        tseslint.configs.strictTypeChecked,
        tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        parserOptions: { projectService: true },
      },
      plugins: { 'simple-import-sort': simpleImportSort },
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'no-restricted-syntax': ['error', noDoubleAssertion],
      },
    },
    {
      files: ['packages/*/src/**/*.ts', 'scripts/**/*.ts'],
      plugins: { 'import-x': importX },
      rules: {
        'import-x/no-cycle': 'error',
        'import-x/no-relative-packages': 'error',
        'import-x/no-relative-parent-imports': 'error',
      },
    },
    {
      files: ['packages/*/src/rules/**/*.ts'],
      extends: [eslintPlugin.configs.recommended],
      rules: {
        'max-lines': ['error', 200],
        'max-lines-per-function': ['error', 30],
        complexity: ['error', 10],
        'eslint-plugin/require-meta-default-options': 'off',
      },
    },
    {
      files: ['packages/*/src/rules/base/adr-structure.ts'],
      rules: { 'eslint-plugin/no-unused-message-ids': 'off' },
    },
    {
      files: ['eslint.config.ts'],
      rules: { '@typescript-eslint/no-misused-spread': 'off' },
    },
  ]),
  {
    files: ['**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'],
    plugins: { arch: ddd },
    rules: { 'arch/base/no-comments': 'error' },
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },
  {
    files: ['**/*.{yml,yaml}'],
    ignores: ['pnpm-lock.yaml'],
    languageOptions: { parser: yamlParser },
    plugins: { arch: ddd },
    rules: { 'arch/base/no-comments': 'error' },
  },
  {
    ...sonarjs.configs?.recommended,
    files: ['packages/*/src/**/*.ts', 'scripts/**/*.ts'],
  },
  eslintConfigPrettier,
];
