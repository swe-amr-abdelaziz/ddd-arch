import {
  analyze,
  reportDate,
  reportFilename,
  reportSectionBodies,
  reportSections,
  reportSubheadings,
} from './adr-structure/checks.mjs';
import { reportTitle } from './adr-structure/title.mjs';

export default {
  meta: {
    type: 'problem',
    fixable: 'code',
    defaultOptions: [
      {
        sections: ['Status', 'Context', 'Decision', 'Consequences'],
        statuses: ['Proposed', 'Accepted', 'Rejected', 'Deprecated'],
        maxLength: {
          Title: 80,
          Status: 120,
          Context: 600,
          Decision: 600,
          Consequences: 600,
        },
      },
    ],
    docs: {
      description:
        'Enforce ADR structure: filename, an H1 title matching it, a valid date, the ordered sections, a status from the allowed set, no sub-headings, and per-section length limits.',
      url: 'https://github.com/swe-amr-abdelaziz/nestjs-ddd-conventions/blob/main/packages/eslint-plugin-nestjs-ddd/docs/rules/base/adr-structure.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          sections: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            description: 'The required section headings, in order.',
          },
          statuses: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            description:
              'The accepted Status values, besides "Superseded by <link>".',
          },
          maxLength: {
            type: 'object',
            additionalProperties: { type: 'integer', minimum: 1 },
            description:
              'Per-section character limits keyed by section name (plus "Title").',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      filename:
        'An ADR file must be named "NNNN-kebab-case-title.md" (at least four digits).',
      numberMismatch:
        'The filename number ({{file}}) and the title number ({{title}}) must match.',
      titleZeroPad:
        'The title number must not be zero-padded (zero-padding belongs to the filename only).',
      titleMismatch: 'The title must match the filename slug "{{slug}}".',
      heading:
        'An ADR must start with an H1 of the form "# <number>. <Title>".',
      titleCase:
        'The ADR title must start with an uppercase letter (sentence case, not Title Case).',
      titlePeriod: 'The ADR title must not end with a period.',
      length:
        'The {{part}} section is {{count}} characters; keep it under {{max}}.',
      date: 'An ADR must carry a "Date: YYYY-MM-DD" line beneath the title.',
      dateInvalid:
        'The ADR date "{{value}}" is not a valid YYYY-MM-DD calendar date.',
      sections:
        'An ADR must contain exactly these sections, in order: {{expected}}.',
      subheading:
        'An ADR has only top-level sections; sub-headings (### or deeper) are not allowed.',
      empty:
        'The "{{name}}" section must not be empty, comment-only, or left as the template placeholder.',
      status: 'Status must be one of: {{allowed}}, or "Superseded by <link>".',
    },
  },
  create(context) {
    const [{ sections, statuses, maxLength }] = context.options;

    return {
      root(node) {
        const model = analyze(context, node);
        reportFilename(context, model);
        if (!model.h1) {
          context.report({ loc: node.position, messageId: 'heading' });
          return;
        }
        reportTitle(context, model, maxLength);
        reportDate(context, model);
        reportSubheadings(context, model);
        reportSections(context, model, sections);
        reportSectionBodies(context, model, sections, statuses, maxLength);
      },
    };
  },
};
