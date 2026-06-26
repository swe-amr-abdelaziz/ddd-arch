import assert from 'node:assert';
import { describe, test } from 'node:test';

import { ESLint } from 'eslint';

import plugin from '../../../src/index.mjs';

const config = (options) => [
  {
    files: ['**/*.mjs'],
    plugins: { arch: plugin },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    rules: {
      'arch/base/no-comments': options ? ['error', options] : 'error',
    },
  },
];

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config(),
});

const idsFor = async (code, options) => {
  const runner = options
    ? new ESLint({ overrideConfigFile: true, overrideConfig: config(options) })
    : eslint;
  const [result] = await runner.lintText(code, { filePath: 'sample.mjs' });
  return result.messages.map((message) => message.messageId);
};

describe('base/no-comments', () => {
  test('a prose line comment is rejected', async () => {
    assert.deepEqual(await idsFor('// explain\nconst a = 1;\n'), ['comment']);
  });

  test('a prose block comment is rejected', async () => {
    assert.deepEqual(await idsFor('/* note */\nconst a = 1;\n'), ['comment']);
  });

  test('a tag-less JSDoc block is rejected', async () => {
    assert.deepEqual(await idsFor('/** just prose */\nconst a = 1;\n'), [
      'comment',
    ]);
  });

  test('an eslint directive is allowed', async () => {
    assert.deepEqual(
      await idsFor('// eslint-disable-next-line no-undef\nx();\n'),
      [],
    );
  });

  test('a ts-check directive is allowed', async () => {
    assert.deepEqual(await idsFor('// @ts-check\nconst a = 1;\n'), []);
  });

  test('a JSDoc type annotation is allowed', async () => {
    assert.deepEqual(await idsFor('/** @type {number} */\nconst a = 1;\n'), []);
  });

  test('a triple-slash reference directive is allowed', async () => {
    assert.deepEqual(
      await idsFor('/// <reference types="node" />\nconst a = 1;\n'),
      [],
    );
  });

  test('a triple-slash prose comment is still rejected', async () => {
    assert.deepEqual(await idsFor('/// just prose\nconst a = 1;\n'), [
      'comment',
    ]);
  });

  test('a consumer-allowed pattern is honored', async () => {
    assert.deepEqual(
      await idsFor('// TODO: revisit\nconst a = 1;\n', { allow: ['^TODO'] }),
      [],
    );
  });

  test('code without comments is accepted', async () => {
    assert.deepEqual(await idsFor('const a = 1;\n'), []);
  });
});
