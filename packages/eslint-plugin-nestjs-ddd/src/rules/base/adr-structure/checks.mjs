import { isRealDate, today } from '../../../utils/date.mjs';
import { stripHeading } from '../../../utils/markdown.mjs';

export const nodeText = (text, node) =>
  text.slice(node.position.start.offset, node.position.end.offset);

export const analyze = (context, node) => {
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

export const reportFilename = (context, { node, fileMatch }) => {
  if (!fileMatch) context.report({ loc: node.position, messageId: 'filename' });
};

export const reportDate = (context, { text, node, h1 }) => {
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

export const reportSubheadings = (context, { headings }) => {
  headings
    .filter((h) => h.depth >= 3)
    .forEach((h) =>
      context.report({ loc: h.position, messageId: 'subheading' }),
    );
};

export const reportSections = (context, { h1, sectionNames }, sections) => {
  if (sectionNames.join('|') !== sections.join('|')) {
    context.report({
      loc: h1.position,
      messageId: 'sections',
      data: { expected: sections.join(', ') },
    });
  }
};

export const reportSectionBodies = (
  context,
  { text, h2, sectionNames },
  sections,
  statuses,
  maxLength,
) => {
  h2.forEach((heading, i) => {
    const name = sectionNames[i];
    if (!sections.includes(name)) return;
    const body = sectionBody(text, h2, i);
    checkSectionBody(context, heading, name, body, statuses, maxLength);
  });
};

const sectionBody = (text, h2, i) => {
  const start = h2[i].position.end.offset;
  const end = i + 1 < h2.length ? h2[i + 1].position.start.offset : text.length;
  return text.slice(start, end).replace(COMMENT, '').trim();
};

const checkSectionBody = (
  context,
  heading,
  name,
  body,
  statuses,
  maxLength,
) => {
  if (body === '' || PLACEHOLDERS.has(body)) {
    context.report({
      loc: heading.position,
      messageId: 'empty',
      data: { name },
    });
    return;
  }
  checkSectionLength(context, heading, name, body, maxLength);
  checkSectionStatus(context, heading, name, body, statuses);
};

const checkSectionLength = (context, heading, name, body, maxLength) => {
  if (!maxLength[name] || body.length <= maxLength[name]) return;
  context.report({
    loc: heading.position,
    messageId: 'length',
    data: {
      part: name,
      count: String(body.length),
      max: String(maxLength[name]),
    },
  });
};

const checkSectionStatus = (context, heading, name, body, statuses) => {
  if (name !== 'Status' || statuses.includes(body) || SUPERSEDED.test(body)) {
    return;
  }
  context.report({
    loc: heading.position,
    messageId: 'status',
    data: { allowed: statuses.join(', ') },
  });
};

const SUPERSEDED = /^Superseded by \S/;
const DATE_LINE = /^Date:\s+/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const FILENAME = /^(\d{4,})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const COMMENT = /<!--[\s\S]*?-->/g;
const PLACEHOLDERS = new Set([
  'The issue motivating this decision, and any context that influences or constrains the decision.',
  "The change that we're proposing or have agreed to implement.",
  'What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.',
]);
