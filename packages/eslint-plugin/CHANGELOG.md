# @ddd-arch/eslint-plugin

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
