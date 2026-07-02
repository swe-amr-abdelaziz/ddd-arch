# composition/root

📝 Enforce composition-root placement: only main.ts and app.module.ts at the source root, and a context module named after each context folder.

<!-- end auto-generated rule header -->

Composition roots have fixed names so the linter can locate them without knowing the framework — the framework-specific wiring lives _inside_ the files, not in their names or positions.

## What it enforces

- Directly under the source root, the only files are **`main.ts`** (the process entrypoint) and **`app.module.ts`** (the root composition). Anything else there is rejected.
- In a **modular monolith**, each bounded context wires itself through a module named after its folder: `<sourceRoot>/<context>/<context>.module.ts` (e.g. `billing/billing.module.ts`).
- A `*.module.ts` anywhere else — inside a layer, misnamed, or a context module in a **microservice** (which has a single context) — is rejected.

## Options

Supplied automatically by `configs.architecture`; you do not set them by hand.

### `topology`

`'microservice'` or `'modular-monolith'` — whether the source root holds one bounded context or many.

### `sourceRoot`

The source directory that holds the layers (default `src`).

## Why

The composition root is the one place the object graph is wired. Fixing its name and position keeps it discoverable and keeps stray files out of the source root, while the framework-specific contents are left to a later, content-level rule.
