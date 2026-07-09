import rule from '@eslint-plugin/rules/base/no-unclassified';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester();

ruleTester.run('base-no-unclassified', rule, {
  valid: [],
  invalid: [
    {
      name: 'a file is denied until an allow pattern turns the rule off',
      filename: 'src/billing/notes.ts',
      code: '',
      errors: [{ messageId: 'unclassified' }],
    },
    {
      name: 'the denial does not depend on file contents',
      filename: 'src/anything.ts',
      code: 'export const x = 1;',
      errors: [{ messageId: 'unclassified' }],
    },
  ],
});
