# 15. Scaffold conformant artifacts with a companion cli

Date: 2026-07-11

## Status

Accepted

## Context

ESLint enforces many file conventions — ADR numbering, filename-to-title-to-slug agreement, section order and length — but authoring conformant files by hand is tedious and error-prone, so contributors routinely discover violations only after the fact. A generator that emits already-conformant scaffolding closes the author-then-lint loop and proves each rule is satisfiable rather than merely restrictive.

## Decision

Ship `@archward/cli` (bin `archward`), plain TypeScript on cac, structured hexagonally: value objects carrying the invariants (slug, contiguous number, sentence-case title), a use-case, a driven filesystem port, and a driving cac adapter wired by a composition root. The first generator, `archward g adr "<title>"`, constructs the file and defers every content check to the linter — an over-long title or an unwritten body surfaces as an ordinary ESLint error. Bodies are emitted as comment prompts, so a fresh ADR reports exactly its unwritten sections.

## Consequences

A generate-then-lint test guarantees the output satisfies `base/adr-structure`. The CLI is architecture-neutral, so it is `@archward/cli` (no architecture prefix). Its own structure will accrue lint findings as new rules ship, fixed progressively as live proof the plugin works. Deferred: a shared `archward.config`, `--cwd` path targeting for monorepos, and generators for the domain and application taxonomy.
