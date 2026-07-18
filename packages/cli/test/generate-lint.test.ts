import { basename } from 'node:path';

import { resolveConfig, type ResolvedAdrConfig } from '@archward/config';
import markdown from '@eslint/markdown';
import rule from '@eslint-plugin/rules/base/adr-structure';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

import { GenerateAdr } from '../src/application/generate-adr';
import type { AdrStore, StoredAdr } from '../src/domain/adr-store';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

class MemoryStore implements AdrStore {
  existingNumbers(): number[] {
    return [];
  }

  save(filename: string): StoredAdr {
    return { path: filename };
  }
}

const generate = (spec: ResolvedAdrConfig) =>
  new GenerateAdr(new MemoryStore()).execute({
    title: 'Record architecture decisions',
    date: '2026-07-11',
    status: spec.statuses[0] ?? 'Proposed',
    sections: spec.sections,
  });

const ruleOptions = (spec: ResolvedAdrConfig) => ({
  sections: spec.sections,
  statuses: spec.statuses,
  maxLength: spec.maxLength,
});

const defaultSpec = resolveConfig().adr;
const defaultAdr = generate(defaultSpec);

const customSpec = resolveConfig({
  adr: {
    sections: ['Status', 'Background', 'Choice'],
    statuses: ['Draft', 'Accepted'],
    maxLength: { Title: 80, Status: 120, Background: 600, Choice: 600 },
  },
}).adr;
const customAdr = generate(customSpec);

const ruleTester = new RuleTester({
  plugins: { markdown },
  language: 'markdown/gfm',
});

ruleTester.run('generated adr conforms to base adr-structure', rule, {
  valid: [],
  invalid: [
    {
      name: 'default config: only the fill-in-me prompts remain',
      filename: basename(defaultAdr.path),
      code: defaultAdr.contents,
      options: [ruleOptions(defaultSpec)],
      errors: [
        { messageId: 'empty' },
        { messageId: 'empty' },
        { messageId: 'empty' },
      ],
    },
    {
      name: 'custom config: generator matches the linter it is fed',
      filename: basename(customAdr.path),
      code: customAdr.contents,
      options: [ruleOptions(customSpec)],
      errors: [{ messageId: 'empty' }, { messageId: 'empty' }],
    },
  ],
});
