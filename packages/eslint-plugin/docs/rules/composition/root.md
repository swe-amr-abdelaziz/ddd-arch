# composition/root

📝 Enforce module placement: a context module is named after its folder and a \*.module.ts lives only at an allowed composition-root location.

<!-- end auto-generated rule header -->

Composition roots have fixed names so the linter can locate them without knowing the framework — the framework-specific wiring lives _inside_ the files, not in their names or positions. This rule governs `*.module.ts` files specifically; which files may sit at the source root is enforced by [`base/no-unclassified`](../base/no-unclassified.md).

## What it enforces

- In a **modular monolith**, each bounded context wires itself through a module named after its folder: `<sourceRoot>/<context>/<context>.module.ts` (e.g. `billing/billing.module.ts`).
- A `*.module.ts` anywhere else — nested inside a layer, misnamed, or a context module in a **microservice** (which has a single context) — is rejected.

## Options

Supplied automatically by `configs.architecture`; you do not set them by hand.

### `topology`

`'microservice'` or `'modular-monolith'` — whether the source root holds one bounded context or many.

### `sourceRoot`

The source directory that holds the layers (default `src`).

## Why

The composition root is the one place the object graph is wired. Fixing its name and position keeps it discoverable, while the framework-specific contents are left to a later, content-level rule.
