import { slugify, stripHeading } from '../../../utils/markdown.mjs';
import { nodeText } from './checks.mjs';

export const reportTitle = (context, { text, fileMatch, h1 }, maxLength) => {
  const h1text = nodeText(text, h1);
  const match = TITLE.exec(stripHeading(h1text));
  if (!match) {
    context.report({ loc: h1.position, messageId: 'heading' });
    return;
  }
  const title = titleModel(h1, h1text, match);
  reportTitleNumber(context, title, fileMatch);
  reportTitleText(context, title, fileMatch);
  reportTitleLength(context, title, maxLength);
};

const titleModel = (h1, h1text, match) => {
  const numberStr = match[1];
  const title = match[2];
  const numStart = h1.position.start.offset + h1text.search(/\d/);
  return {
    h1,
    h1text,
    numberStr,
    number: Number(numberStr),
    title,
    numRange: [numStart, numStart + numberStr.length],
    titleStart: h1.position.start.offset + h1text.lastIndexOf(title),
  };
};

const reportTitleNumber = (
  context,
  { h1, numberStr, number, numRange },
  fileMatch,
) => {
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
};

const reportTitleText = (context, { h1, title, titleStart }, fileMatch) => {
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
  reportTitlePeriod(context, h1, title, titleStart);
};

const reportTitlePeriod = (context, h1, title, titleStart) => {
  if (!title.endsWith('.')) return;
  let dots = 1;
  while (title[title.length - 1 - dots] === '.') dots += 1;
  const dotsEnd = titleStart + title.length;
  context.report({
    loc: h1.position,
    messageId: 'titlePeriod',
    fix: (fixer) => fixer.removeRange([dotsEnd - dots, dotsEnd]),
  });
};

const reportTitleLength = (context, { h1, h1text }, maxLength) => {
  if (h1text.length <= maxLength.Title) return;
  context.report({
    loc: h1.position,
    messageId: 'length',
    data: {
      part: 'Title',
      count: String(h1text.length),
      max: String(maxLength.Title),
    },
  });
};

const TITLE = /^(\d+)\. (\S.*)$/;
