# 10. Enforce a fixed composition-root file convention

Date: 2026-07-02

## Status

Accepted

## Context

The composition root — where the object graph is wired — is framework-shaped: NestJS uses a module, a plain app a container or `main.ts`. But its file names and positions need not be framework-specific, and the linter must locate it to police the source root and, later, its dependencies. An any-name convention would make composition roots undiscoverable and let stray files accumulate directly under the source root.

## Decision

Composition-root files follow a fixed, framework-neutral convention. Directly under the source root only two files exist: `main.ts` (the entrypoint) and `app.module.ts` (the root composition), for both topologies. A modular monolith additionally wires each context through `<sourceRoot>/<context>/<context>.module.ts`, named after its folder. The `composition/root` rule enforces these names and positions only; framework-specific file contents are deferred. `configs.architecture` supplies the rule its topology and source root.

## Consequences

The linter locates composition roots without framework knowledge, and `.module.ts` becomes the cross-framework convention with the wiring living inside the file. The source root stays clean — only an entrypoint and a root module. Existence is not enforced: a missing composition root breaks the app at boot, so a lint check would add nothing. Content-level rules (single class, decorator, and which layers a module may import) arrive in later slices once the layer composables are defined.
