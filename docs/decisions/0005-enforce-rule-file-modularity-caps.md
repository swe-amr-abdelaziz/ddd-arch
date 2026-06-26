# 5. Enforce rule-file modularity caps

Date: 2026-06-26

## Status

Accepted

## Context

A rule's logic accretes — parsing, several checks, and autofixers — until one module sprawls and the most complex rule sets the de-facto ceiling for the rest. Reviewing and changing such files is slow and error-prone. We want a structural ceiling enforced mechanically on our own rule sources, not left to discipline.

## Decision

Lint rule sources with core ESLint: `max-lines` 200, `max-lines-per-function` 30, and `complexity` 10, counting physical lines — no skip-blanks loophole, so the cap means what a reader sees. A rule that would exceed them keeps its entry at `<name>.mjs` (so rule, test, and doc stay one-to-one) and moves its helpers into a same-named sibling folder (`adr-structure/checks.mjs`, `title.mjs`). Because `meta.messages` then sit apart from the `context.report` calls, `eslint-plugin/no-unused-message-ids` is disabled for such delegating entries; single-file rules keep it.

## Consequences

Rule files stay small and reviewable, and the cap is honest — a 1000-line file cannot hide under skipped blanks. `adr-structure` is one `adr-structure.mjs` entry plus an `adr-structure/` folder of cohesive checks, identical in behaviour. The bijection (rule ↔ test ↔ doc) holds because the entry path is unchanged; helper folders and group barrels are excluded from it.
