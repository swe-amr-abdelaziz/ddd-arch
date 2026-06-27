# 7. Verify with local hooks and authoritative CI

Date: 2026-06-27

## Status

Accepted

## Context

As the rule set grows, regressions in formatting, dead code, import cycles, spelling, rule-test-doc parity, and ADR hygiene must be caught automatically rather than in review. Two needs pull apart: a developer wants fast feedback on a small change, while the project needs an exhaustive, trustworthy gate before anything merges. One layer cannot serve both — it is either too slow locally or too lax for merge.

## Decision

Run two layers. Husky gives local fast-fail on staged files: the pre-commit hook runs lint-staged (eslint, prettier, cspell), parity, and ADR numbering; the commit-message hook runs commitlint. GitHub Actions is authoritative and runs the whole repo: lint with no-cycle, typecheck, test, format, docs, cspell, knip, parity, ADR numbering, changeset status, and ADR-on-feat. ADR-on-feat needs the commit type, so it lives only in CI, comparing the branch to its base.

## Consequences

Most mistakes surface in seconds locally, while CI stays the single source of truth a merge depends on. The hooks duplicate a subset of CI deliberately, trading minor redundancy for speed. ADR-on-feat reads its trigger types from package.json, defaulting to feat, so a consumer can widen them later. Parity is authoring-only and stays internal; the ADR checks are candidates for a future consumer CLI.
