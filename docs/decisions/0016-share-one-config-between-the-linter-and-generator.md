# 16. Share one config between the linter and generator

Date: 2026-07-18

## Status

Accepted

## Context

The ADR spec — sections, statuses, per-section length caps, and the ADR directory — was hardcoded three times: in the CLI generator, in the rule's default options, and as a directory glob split between the preset and a `.adr-dir` marker. The copies drift, so a project that customizes `base/adr-structure` gets generated files its own linter then rejects. ADR 0015 deferred a shared config to close this gap.

## Decision

Introduce `@archward/config`, one package owning the ADR spec, its built-in defaults, and an async `loadConfig(cwd)` that discovers an optional `archward.config.{ts,js,mjs,cjs,json}` and merges it over the defaults. Both consumers read it: the ESLint `adr` preset auto-loads it for its file glob and rule options, and the CLI resolves sections, default status, and output directory from it. Precedence is explicit flag, then `archward.config`, then defaults. Loading is async because jiti deprecates its synchronous entry.

## Consequences

Generator and linter cannot drift: a generated ADR passes the same project's `base/adr-structure` by construction, proven by a generate-then-lint test under a custom config. The `adr` preset is now async, so consumers spread `await ddd.configs.adr`. The `.adr-dir` marker is superseded by `adr.dir`. Deferred: the broader primitive-kit config surface, and upward config discovery beyond the current working directory.
