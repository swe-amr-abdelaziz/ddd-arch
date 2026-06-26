# adr-structure

Enforce the structure of Architecture Decision Records under `docs/decisions/`.

An ADR must be a well-formed, concise [Nygard-style](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) record. This rule checks **structure and length**; formatting (line length, blank lines) is left to Prettier.

## What it enforces

- **Filename** — `NNNN-kebab-case-title.md` (at least four digits); the number and the kebab slug must match the title.
- **Title** — an H1 `# <number>. <Title>`, sentence case (first letter uppercase), an **unpadded** number, no trailing period, within the title limit.
- **Date** — a `Date: YYYY-MM-DD` line that is a real calendar date (`2026-06-32` is rejected).
- **Sections** — exactly `## Status`, `## Context`, `## Decision`, `## Consequences`, in that order, nothing else.
- **No sub-headings** — `###` or deeper is not allowed.
- **Status** — one of `Proposed`, `Accepted`, `Rejected`, `Deprecated`, or `Superseded by <link>`.
- **Length** — each section stays under its limit. A section that is empty, comment-only, or left as the template placeholder is rejected.

## Auto-fixable

- a lowercase title is capitalised,
- trailing periods are stripped (all at once),
- a zero-padded title number is trimmed,
- a title number is corrected to match the filename,
- a missing date is stamped with today's date.

Renamed/extra sections and sub-headings are **reported but never auto-deleted** — that would destroy authored content.

## Options

```js
{
  "arch/adr-structure": ["error", {
    "sections": ["Status", "Context", "Decision", "Consequences"],
    "statuses": ["Proposed", "Accepted", "Rejected", "Deprecated"],
    "maxLength": { "Title": 80, "Status": 120, "Context": 600, "Decision": 600, "Consequences": 600 }
  }]
}
```

All three options default to the values above; override any subset.

## Example

```md
# 1. Use a transactional outbox

Date: 2026-06-26

## Status

Accepted

## Context

Cross-service events published after commit can be lost if the broker is down.

## Decision

Write events to an outbox table inside the same transaction; a relay drains it.

## Consequences

Exactly-once delivery, at the cost of an outbox table and a relay process.
```
