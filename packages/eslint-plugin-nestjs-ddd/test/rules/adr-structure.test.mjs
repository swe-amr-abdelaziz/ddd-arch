import assert from 'node:assert';
import { describe, test } from 'node:test';

import markdown from '@eslint/markdown';
import { ESLint } from 'eslint';

import plugin from '../../src/index.mjs';

const config = (options) => [
  {
    files: ['**/*.md'],
    plugins: { markdown, arch: plugin },
    language: 'markdown/gfm',
    rules: {
      'arch/adr-structure': options ? ['error', options] : 'error',
    },
  },
];

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config(),
});
const autofixer = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config(),
  fix: true,
});

const FILE = { filePath: 'docs/decisions/0001-lint-adr-structure.md' };

const idsFor = async (body, options) => {
  const runner = options
    ? new ESLint({ overrideConfigFile: true, overrideConfig: config(options) })
    : eslint;
  const [result] = await runner.lintText(body, FILE);
  return result.messages.map((message) => message.messageId);
};

const fixOutput = async (body) => {
  const [result] = await autofixer.lintText(body, FILE);
  return result.output ?? body;
};

const idsForPath = async (body, filePath) => {
  const [result] = await eslint.lintText(body, { filePath });
  return result.messages.map((message) => message.messageId);
};

const fixOutputPath = async (body, filePath) => {
  const [result] = await autofixer.lintText(body, { filePath });
  return result.output ?? body;
};

const VALID = `# 1. Lint ADR structure

Date: 2026-06-26

## Status

Accepted

## Context

Free-form rationale drifts and gets padded; we want a deterministic gate.

## Decision

Lint the four ordered sections and per-section limits over the markdown AST.

## Consequences

Rationale stays terse and machine-checked; prose grammar is out of scope.
`;

describe('adr-structure', () => {
  test('a well-formed ADR is accepted', async () => {
    assert.deepEqual(await idsFor(VALID), []);
  });

  test('a lowercase title is rejected', async () => {
    const ids = await idsFor(
      VALID.replace('# 1. Lint ADR structure', '# 1. lint ADR structure'),
    );
    assert.ok(ids.includes('titleCase'));
  });

  test('a title ending in a period is rejected', async () => {
    const ids = await idsFor(
      VALID.replace('# 1. Lint ADR structure', '# 1. Lint ADR structure.'),
    );
    assert.ok(ids.includes('titlePeriod'));
  });

  test('a missing date is rejected', async () => {
    const ids = await idsFor(VALID.replace('Date: 2026-06-26\n\n', ''));
    assert.ok(ids.includes('date'));
  });

  test('an impossible date is rejected', async () => {
    const ids = await idsFor(VALID.replace('2026-06-26', '2026-06-32'));
    assert.ok(ids.includes('dateInvalid'));
  });

  test('a renamed section is rejected', async () => {
    const ids = await idsFor(VALID.replace('## Context', '## Background'));
    assert.ok(ids.includes('sections'));
  });

  test('a sub-heading is rejected', async () => {
    const ids = await idsFor(
      VALID.replace('## Decision', '## Decision\n\n### Detail'),
    );
    assert.ok(ids.includes('subheading'));
  });

  test('an empty (placeholder) section is rejected', async () => {
    const ids = await idsFor(
      VALID.replace(
        'Free-form rationale drifts and gets padded; we want a deterministic gate.',
        'The issue motivating this decision, and any context that influences or constrains the decision.',
      ),
    );
    assert.ok(ids.includes('empty'));
  });

  test('a comment-only section is rejected', async () => {
    const ids = await idsFor(
      VALID.replace(
        'Free-form rationale drifts and gets padded; we want a deterministic gate.',
        '<!-- to be written -->',
      ),
    );
    assert.ok(ids.includes('empty'));
  });

  test('an over-long section is rejected', async () => {
    const ids = await idsFor(
      VALID.replace(
        'Free-form rationale drifts and gets padded; we want a deterministic gate.',
        'x'.repeat(700),
      ),
    );
    assert.ok(ids.includes('length'));
  });

  test('a status outside the enum is rejected', async () => {
    const ids = await idsFor(VALID.replace('Accepted', 'Done'));
    assert.ok(ids.includes('status'));
  });

  test('a title over the limit is rejected', async () => {
    const long = `# 1. ${'Word '.repeat(20).trim()}

Date: 2026-06-26

## Status

Accepted

## Context

x

## Decision

x

## Consequences

x
`;
    assert.ok((await idsFor(long)).includes('length'));
  });

  test('a custom maxLength is honored', async () => {
    const ids = await idsFor(VALID, { maxLength: { Context: 20 } });
    assert.ok(ids.includes('length'));
  });

  test('a custom status set is honored', async () => {
    const ids = await idsFor(VALID, { statuses: ['Draft'] });
    assert.ok(ids.includes('status'));
  });

  test('a partial maxLength override keeps the other defaults', async () => {
    assert.deepEqual(await idsFor(VALID, { maxLength: { Context: 600 } }), []);
  });

  test('autofix capitalizes a lowercase title', async () => {
    const out = await fixOutput(
      VALID.replace('# 1. Lint ADR structure', '# 1. lint ADR structure'),
    );
    assert.match(out, /# 1\. Lint ADR structure/);
  });

  test('autofix strips a trailing period from the title', async () => {
    const out = await fixOutput(
      VALID.replace('# 1. Lint ADR structure', '# 1. Lint ADR structure.'),
    );
    assert.ok(!out.split('\n')[0].endsWith('.'));
  });

  test('autofix inserts a date when missing', async () => {
    const out = await fixOutput(VALID.replace('Date: 2026-06-26\n\n', ''));
    assert.match(out, /Date: \d{4}-\d{2}-\d{2}/);
  });

  test('a bad filename is rejected', async () => {
    const ids = await idsForPath(VALID, 'docs/decisions/1-bad.md');
    assert.ok(ids.includes('filename'));
  });

  test('a filename number not matching the title is rejected', async () => {
    const ids = await idsForPath(VALID, 'docs/decisions/0009-mismatch.md');
    assert.ok(ids.includes('numberMismatch'));
  });

  test('a zero-padded title number is rejected', async () => {
    const ids = await idsFor(
      VALID.replace('# 1. Lint ADR structure', '# 01. Lint ADR structure'),
    );
    assert.ok(ids.includes('titleZeroPad'));
  });

  test('autofix trims a zero-padded title number', async () => {
    const out = await fixOutput(
      VALID.replace('# 1. Lint ADR structure', '# 01. Lint ADR structure'),
    );
    assert.match(out, /# 1\. Lint ADR structure/);
  });

  test('autofix matches the title number to the filename', async () => {
    const out = await fixOutputPath(
      VALID.replace('# 1. Lint ADR structure', '# 2. Lint ADR structure'),
      'docs/decisions/0001-lint-adr-structure.md',
    );
    assert.match(out, /# 1\. Lint ADR structure/);
  });

  test('a title not matching the filename slug is rejected', async () => {
    const ids = await idsForPath(
      VALID,
      'docs/decisions/0001-different-slug.md',
    );
    assert.ok(ids.includes('titleMismatch'));
  });

  test('autofix strips all trailing periods at once', async () => {
    const out = await fixOutput(
      VALID.replace('# 1. Lint ADR structure', '# 1. Lint ADR structure...'),
    );
    assert.ok(!out.split('\n')[0].endsWith('.'));
  });

  test('a malformed title is rejected', async () => {
    const ids = await idsFor(
      VALID.replace('# 1. Lint ADR structure', '# No number here'),
    );
    assert.ok(ids.includes('heading'));
  });

  test('a custom sections set is honored', async () => {
    const custom = `# 1. Lint ADR structure

Date: 2026-06-26

## Status

Accepted

## Decision

A concise decision.
`;
    assert.deepEqual(
      await idsFor(custom, { sections: ['Status', 'Decision'] }),
      [],
    );
  });
});
