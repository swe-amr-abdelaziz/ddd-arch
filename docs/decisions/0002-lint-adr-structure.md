# 2. Lint ADR structure

Date: 2026-06-26

## Status

Accepted

## Context

Free-form rationale documents drift and get padded, with no deterministic check that an ADR is well-formed or concise. We want the same machine-checkability we apply to code.

## Decision

Lint docs/decisions with the eslint-plugin-nestjs-ddd arch/adr-structure rule (over @eslint/markdown): require an H1 numbered title in sentence case without a trailing period, a valid calendar date, exactly the four ordered sections with no sub-headings, a status from a fixed set, and per-section maximum lengths (80/120/600/600/600 characters). Section names, statuses, and limits are configurable options that default to these values; lowercase titles, trailing periods, and a missing date are auto-fixable.

## Consequences

ADRs stay uniform and terse, and a malformed or padded one fails CI. Prose grammar such as capitalisation and end punctuation is deferred to a formatter (Prettier). The rule ships opt-in for consumers, disabled by default, and can be tuned via options for teams with other conventions.
