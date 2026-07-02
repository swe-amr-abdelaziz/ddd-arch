import rule from '@eslint-plugin/rules/composition/root';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const micro = { topology: 'microservice', sourceRoot: 'src' } as const;
const mono = { topology: 'modular-monolith', sourceRoot: 'src' } as const;

const ruleTester = new RuleTester();

ruleTester.run('composition-root', rule, {
  valid: [
    {
      name: 'the entrypoint at the root',
      filename: 'src/main.ts',
      code: '',
      options: [micro],
    },
    {
      name: 'the root composition module',
      filename: 'src/app.module.ts',
      code: '',
      options: [micro],
    },
    {
      name: 'a layer file in a microservice',
      filename: 'src/domain/user.ts',
      code: '',
      options: [micro],
    },
    {
      name: 'a context module named after its folder',
      filename: 'src/billing/billing.module.ts',
      code: '',
      options: [mono],
    },
    {
      name: 'a layer file in a context',
      filename: 'src/billing/domain/user.ts',
      code: '',
      options: [mono],
    },
    {
      name: 'a custom source root',
      filename: 'app/app.module.ts',
      code: '',
      options: [{ topology: 'microservice', sourceRoot: 'app' }],
    },
    {
      name: 'a file outside the source root is ignored',
      filename: 'scripts/build.ts',
      code: '',
      options: [micro],
    },
  ],
  invalid: [
    {
      name: 'a stray file directly under the source root',
      filename: 'src/helpers.ts',
      code: '',
      options: [micro],
      errors: [{ messageId: 'rootFile' }],
    },
    {
      name: 'a context module not named after its folder',
      filename: 'src/billing/user.module.ts',
      code: '',
      options: [mono],
      errors: [{ messageId: 'moduleName' }],
    },
    {
      name: 'a module nested inside a layer',
      filename: 'src/billing/domain/user.module.ts',
      code: '',
      options: [mono],
      errors: [{ messageId: 'moduleLocation' }],
    },
    {
      name: 'a context module in a microservice',
      filename: 'src/billing/billing.module.ts',
      code: '',
      options: [micro],
      errors: [{ messageId: 'moduleLocation' }],
    },
  ],
});
