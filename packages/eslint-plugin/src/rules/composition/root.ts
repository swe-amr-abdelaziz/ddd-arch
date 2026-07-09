import type { Topology } from '@eslint-plugin/configs/architecture/types';
import { createRule } from '@eslint-plugin/utils/create-rule';

type Options = [{ topology: Topology; sourceRoot: string }];
type MessageId = 'moduleName' | 'moduleLocation';

interface Violation {
  messageId: MessageId;
  data: Record<string, string>;
}

const MODULE_SUFFIX = '.module.ts';

const moduleViolation = (
  within: string[],
  basename: string,
  topology: Topology,
  sourceRoot: string,
): Violation | null => {
  if (!basename.endsWith(MODULE_SUFFIX)) return null;

  if (topology === 'modular-monolith' && within.length === 2) {
    const expected = `${within[0] ?? ''}${MODULE_SUFFIX}`;
    return basename === expected
      ? null
      : { messageId: 'moduleName', data: { expected } };
  }

  return { messageId: 'moduleLocation', data: { sourceRoot } };
};

const analyze = (
  filename: string,
  topology: Topology,
  sourceRoot: string,
): Violation | null => {
  const segments = filename.replace(/\\/g, '/').split('/');
  const srcIndex = segments.lastIndexOf(sourceRoot);
  if (srcIndex === -1) return null;

  const within = segments.slice(srcIndex + 1);
  const basename = within[within.length - 1] ?? '';

  if (within.length === 1) return null;

  return moduleViolation(within, basename, topology, sourceRoot);
};

export default createRule<Options, MessageId>({
  name: 'composition/root',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce module placement: a context module is named after its folder and a *.module.ts lives only at an allowed composition-root location.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          topology: {
            type: 'string',
            enum: ['microservice', 'modular-monolith'],
            description: 'The bounded-context layout of the source root.',
          },
          sourceRoot: {
            type: 'string',
            description: 'The source directory that holds the layers.',
          },
        },
        required: ['topology', 'sourceRoot'],
        additionalProperties: false,
      },
    ],
    messages: {
      moduleName:
        "A context module must be named after its folder; expected '{{expected}}'.",
      moduleLocation:
        "A '*.module.ts' may only be '{{sourceRoot}}/app.module.ts' or a context module '{{sourceRoot}}/<context>/<context>.module.ts'.",
    },
  },
  defaultOptions: [{ topology: 'modular-monolith', sourceRoot: 'src' }],
  create(context, [{ topology, sourceRoot }]) {
    return {
      Program(node) {
        const violation = analyze(context.filename, topology, sourceRoot);
        if (violation) {
          context.report({ node, ...violation });
        }
      },
    };
  },
});
