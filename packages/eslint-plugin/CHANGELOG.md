# @ddd-arch/eslint-plugin

## 0.3.0

### Minor Changes

- 5a69133: Add the `configs.architecture({ topology, sourceRoot })` preset factory. It requires a `topology` (`microservice` or `modular-monolith`) and takes an optional `sourceRoot` (defaults to `src`, must be non-blank), then resolves the per-layer globs — layers at the source root for a microservice, or one level under a bounded-context folder for a modular monolith. Invalid input throws at config-load time.

## 0.2.2

### Patch Changes

- e47962c: Internal refactor of the ADR rule: use a type predicate instead of a type assertion after the title check. No API or behavior change.

## 0.2.1

### Patch Changes

- 5484a72: Widen the `eslint` peer range to `^9.6.0 || ^10.0.0` — the plugin works on ESLint 9 (e.g. a `nest new` project), so requiring 10 was too strict. The 9.6.0 floor is set by the Languages API that the ADR/markdown config depends on. Also expose `./package.json` through the `exports` map for tooling that reads it.

## 0.2.0

### Minor Changes

- ba04dc4: Author the plugin in strict TypeScript and build it with tsup. The published package now ships compiled ESM `dist/` with bundled type declarations instead of raw `.mjs` sources.

  `base/no-comments` is now TypeScript-native: it no longer allows the JS-only `@ts-check` pragma or JSDoc `@type` annotations (write real TypeScript types instead). The `@ts-expect-error` / `@ts-ignore` / `@ts-nocheck` pragmas and triple-slash references are still allowed.

## 0.1.2

### Patch Changes

- 2d28f5e: Harden two internal regular expressions against super-linear runtime on adversarial input; behaviour unchanged.

## 0.1.1

### Patch Changes

- d1f4d97: Reposition as framework-agnostic for TypeScript backends; drop the NestJS-specific framing.

## 0.1.0

### Minor Changes

- 20959d6: Add the `arch/base/adr-structure` rule: enforce the ADR filename, an H1 title, a valid date, the ordered sections, a status from a fixed set, no sub-headings, and per-section length limits. The `sections`, `statuses`, and `maxLength` are configurable options; lowercase titles, trailing periods, and a missing date are auto-fixable.
- 02f429f: Add the `base/no-comments` rule: bans comments except tool directives (`eslint*`, `@ts-*`, …) and JSDoc type annotations, so rationale lives in commits and ADRs instead of rotting in the code.

### Patch Changes

- b4fc92c: Declare `meta.defaultOptions` on `adr-structure` and describe its schema options; rule sources are now linted with eslint-plugin-eslint-plugin and their docs generated with eslint-doc-generator.
- b2c4134: Prepare the package for npm: public access, repository and homepage metadata, keywords, and a bundled MIT license.
