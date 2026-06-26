export default {
  meta: {
    type: 'suggestion',
    defaultOptions: [{ allow: [] }],
    docs: {
      description:
        'Disallow comments except tool directives and JSDoc type annotations; rationale belongs in commit messages, ADRs, or docs.',
      url: 'https://github.com/swe-amr-abdelaziz/nestjs-ddd-conventions/blob/main/packages/eslint-plugin-nestjs-ddd/docs/rules/base/no-comments.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Extra regular-expression patterns; a comment whose trimmed text matches any of them is allowed (e.g. "^TODO", "^FIXME").',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      comment:
        'Remove this comment — code should be self-documenting; put rationale in the commit message, an ADR, or docs.',
    },
  },
  create(context) {
    const { sourceCode } = context;
    const [{ allow }] = context.options;
    const allowed = allow.map((pattern) => new RegExp(pattern));
    const isAllowed = (comment) =>
      allowed.some((re) => re.test(comment.value.trim()));
    return {
      Program() {
        sourceCode.getAllComments().forEach((comment) => {
          if (comment.type !== 'Line' && comment.type !== 'Block') return;
          if (
            isDirective(comment) ||
            isTripleSlash(comment) ||
            isJsDocType(comment) ||
            isAllowed(comment)
          )
            return;
          context.report({ loc: comment.loc, messageId: 'comment' });
        });
      },
    };
  },
};

const DIRECTIVE =
  /^(eslint\b|globals?\b|exported\b|@ts-(expect-error|ignore|nocheck|check)\b)/;

const isDirective = (comment) => DIRECTIVE.test(comment.value.trim());

const TRIPLE_SLASH = /^\/\s*<(reference|amd-(module|dependency))\b/;

const isTripleSlash = (comment) =>
  comment.type === 'Line' && TRIPLE_SLASH.test(comment.value.trim());

const isJsDocType = (comment) =>
  comment.type === 'Block' &&
  comment.value.trimStart().startsWith('*') &&
  /@\w/.test(comment.value);
