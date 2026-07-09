import { createRule } from '@eslint-plugin/utils/create-rule';

type MessageId = 'unclassified';

export default createRule<[], MessageId>({
  name: 'base/no-unclassified',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Deny every source file by default; an allowed pattern must turn this rule off, so no file escapes the architecture.',
    },
    schema: [],
    messages: {
      unclassified:
        'This file is not part of the architecture. Every file under the source root must be an entrypoint, a module, or live in a bounded-context layer. Move or rename it to fit an allowed location, or add its pattern to the architecture preset.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Program(node) {
        context.report({ node, messageId: 'unclassified' });
      },
    };
  },
});
