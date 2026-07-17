import { describe, expect, it } from 'vitest';

import { AdrDocument } from '../src/domain/adr-document';
import { AdrNumber } from '../src/domain/adr-number';
import { ADR_SECTIONS } from '../src/domain/adr-spec';
import { AdrTitle } from '../src/domain/adr-title';

const build = (title: string, status = 'Proposed') =>
  new AdrDocument({
    number: AdrNumber.next([]),
    title: AdrTitle.from(title),
    date: '2026-07-11',
    status,
    sections: ADR_SECTIONS,
  });

describe('AdrDocument', () => {
  it('names the file NNNN-slug.md with a zero-padded number', () => {
    expect(build('Use a message queue').filename).toBe(
      '0001-use-a-message-queue.md',
    );
  });

  it('renders an un-padded title number whose text matches the file slug', () => {
    expect(build('Use a message queue').render()).toContain(
      '# 1. Use a message queue',
    );
  });

  it('fills Status but leaves other bodies as empty comment prompts', () => {
    const markdown = build('Use a message queue').render();
    expect(markdown).toContain('## Status\n\nProposed\n');
    expect(markdown).toContain('## Context\n\n<!--');
  });
});
