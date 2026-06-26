# 4. Ban comments except directives and type annotations

Date: 2026-06-26

## Status

Accepted

## Context

Comments are unversioned claims about code that no test enforces, so they rot; LLM-assisted authoring compounds this by emitting explanatory prose by default. But build-free `.mjs` rules rely on JSDoc `@type` for `@ts-check`, and both ESLint and TypeScript read directive comments — a blanket ban would break tooling.

## Decision

Ship `arch/no-comments`: report every comment except (1) tool directives — `eslint*`, `global(s)`, `exported`, the `@ts-*` pragmas, and `///` triple-slash references — and (2) JSDoc blocks that start with `*` and carry an `@`-tag. Tag-less JSDoc is prose and is rejected. The JSDoc allowance is what keeps `@ts-check` type hints working in build-free `.mjs`, where types live in `/** @type … */` rather than native syntax. Applied to our own `.mjs`/`.js`.

## Consequences

Rationale moves to commit messages and ADRs, where it is versioned and reviewed; the codebase stays prose-free and the type-checked `.mjs` keeps working. The rule is report-only — comments are never auto-deleted, since an unrecognised directive must not be silently removed. Consumers opt in; a future recommended preset will bundle it.
