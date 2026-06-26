import { isRealDate, today } from '../utils/date.mjs';
import { slugify, stripHeading } from '../utils/markdown.mjs';

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
      url: 'https://github.com/swe-amr-abdelaziz/nestjs-ddd-conventions/blob/main/packages/eslint-plugin-nestjs-ddd/docs/rules/adr-structure.md',
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

const SUPERSEDED = /^Superseded by \S/;
const DATE_LINE = /^Date:\s+/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const TITLE = /^(\d+)\. (\S.*)$/;
const FILENAME = /^(\d{4,})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const TRAILING_DOTS = /\.+$/;
const COMMENT = /<!--[\s\S]*?-->/g;
const PLACEHOLDERS = new Set([
  'The issue motivating this decision, and any context that influences or constrains the decision.',
  "The change that we're proposing or have agreed to implement.",
  'What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.',
]);

const nodeText = (text, node) =>
  text.slice(node.position.start.offset, node.position.end.offset);

const analyze = (context, node) => {
  const text = context.sourceCode.getText();
  const base = context.filename.split('/').pop() ?? '';
  const headings = node.children.filter((c) => c.type === 'heading');
  const h2 = headings.filter((h) => h.depth === 2);
  return {
    node,
    text,
    fileMatch: FILENAME.exec(base),
    headings,
    h1: headings.find((h) => h.depth === 1),
    h2,
    sectionNames: h2.map((h) => stripHeading(nodeText(text, h))),
  };
};

const reportFilename = (context, { node, fileMatch }) => {
  if (!fileMatch) context.report({ loc: node.position, messageId: 'filename' });
};

const reportTitle = (context, { text, fileMatch, h1 }, maxLength) => {
  const h1text = nodeText(text, h1);
  const match = TITLE.exec(stripHeading(h1text));
  if (!match) {
    context.report({ loc: h1.position, messageId: 'heading' });
    return;
  }
  const numberStr = match[1];
  const number = Number(numberStr);
  const title = match[2];
  const numStart = h1.position.start.offset + h1text.search(/\d/);
  const numRange = [numStart, numStart + numberStr.length];
  const titleStart = h1.position.start.offset + h1text.lastIndexOf(title);

  if (numberStr !== String(number)) {
    context.report({
      loc: h1.position,
      messageId: 'titleZeroPad',
      fix: (fixer) => fixer.replaceTextRange(numRange, String(number)),
    });
  }
  if (fileMatch && Number(fileMatch[1]) !== number) {
    context.report({
      loc: h1.position,
      messageId: 'numberMismatch',
      data: { file: String(Number(fileMatch[1])), title: String(number) },
      fix: (fixer) =>
        fixer.replaceTextRange(numRange, String(Number(fileMatch[1]))),
    });
  }
  if (fileMatch && slugify(title) !== fileMatch[2]) {
    context.report({
      loc: h1.position,
      messageId: 'titleMismatch',
      data: { slug: fileMatch[2] },
    });
  }
  if (title[0] !== title[0].toUpperCase()) {
    context.report({
      loc: h1.position,
      messageId: 'titleCase',
      fix: (fixer) =>
        fixer.replaceTextRange(
          [titleStart, titleStart + 1],
          title[0].toUpperCase(),
        ),
    });
  }
  const trail = TRAILING_DOTS.exec(title);
  if (trail) {
    const dotsEnd = titleStart + title.length;
    context.report({
      loc: h1.position,
      messageId: 'titlePeriod',
      fix: (fixer) => fixer.removeRange([dotsEnd - trail[0].length, dotsEnd]),
    });
  }
  if (h1text.length > maxLength.Title) {
    context.report({
      loc: h1.position,
      messageId: 'length',
      data: {
        part: 'Title',
        count: String(h1text.length),
        max: String(maxLength.Title),
      },
    });
  }
};

const reportDate = (context, { text, node, h1 }) => {
  const dateNode = node.children.find(
    (c) => c.type === 'paragraph' && DATE_LINE.test(nodeText(text, c).trim()),
  );
  if (!dateNode) {
    const end = h1.position.end.offset;
    context.report({
      loc: h1.position,
      messageId: 'date',
      fix: (fixer) =>
        fixer.replaceTextRange([end, end], `\n\nDate: ${today()}`),
    });
    return;
  }
  const value = nodeText(text, dateNode).trim().replace(DATE_LINE, '');
  if (!ISO.test(value) || !isRealDate(value)) {
    context.report({
      loc: dateNode.position,
      messageId: 'dateInvalid',
      data: { value },
    });
  }
};

const reportSubheadings = (context, { headings }) => {
  headings
    .filter((h) => h.depth >= 3)
    .forEach((h) =>
      context.report({ loc: h.position, messageId: 'subheading' }),
    );
};

const reportSections = (context, { h1, sectionNames }, sections) => {
  if (sectionNames.join('|') !== sections.join('|')) {
    context.report({
      loc: h1.position,
      messageId: 'sections',
      data: { expected: sections.join(', ') },
    });
  }
};

const reportSectionBodies = (
  context,
  { text, h2, sectionNames },
  sections,
  statuses,
  maxLength,
) => {
  h2.forEach((heading, i) => {
    const name = sectionNames[i];
    if (!sections.includes(name)) return;
    const start = heading.position.end.offset;
    const end =
      i + 1 < h2.length ? h2[i + 1].position.start.offset : text.length;
    const body = text.slice(start, end).replace(COMMENT, '').trim();
    if (body === '' || PLACEHOLDERS.has(body)) {
      context.report({
        loc: heading.position,
        messageId: 'empty',
        data: { name },
      });
      return;
    }
    if (maxLength[name] && body.length > maxLength[name]) {
      context.report({
        loc: heading.position,
        messageId: 'length',
        data: {
          part: name,
          count: String(body.length),
          max: String(maxLength[name]),
        },
      });
    }
    if (
      name === 'Status' &&
      !statuses.includes(body) &&
      !SUPERSEDED.test(body)
    ) {
      context.report({
        loc: heading.position,
        messageId: 'status',
        data: { allowed: statuses.join(', ') },
      });
    }
  });
};
