import { basename } from 'node:path';

import markdown from '@eslint/markdown';
import rule from '@eslint-plugin/rules/base/adr-structure';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

import { GenerateAdr } from '../src/application/generate-adr';
import { ADR_SECTIONS } from '../src/domain/adr-spec';
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

const generated = new GenerateAdr(new MemoryStore()).execute({
  title: 'Record architecture decisions',
  date: '2026-07-11',
  status: 'Proposed',
  sections: ADR_SECTIONS,
});

const ruleTester = new RuleTester({
  plugins: { markdown },
  language: 'markdown/gfm',
});

ruleTester.run('generated adr conforms to base adr-structure', rule, {
  valid: [],
  invalid: [
    {
      filename: basename(generated.path),
      code: generated.contents,
      errors: [
        { messageId: 'empty' },
        { messageId: 'empty' },
        { messageId: 'empty' },
      ],
    },
  ],
});
