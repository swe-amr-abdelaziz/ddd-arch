# @ddd-arch/eslint-plugin

## 0.8.0

### Minor Changes

- 069bbe3: Share one `archward.config` between the linter and the generator.

  The ADR spec (sections, statuses, per-section `maxLength`, and the ADR
  directory) now lives in a single new package, `@archward/config`, that both the
  ESLint `adr` preset and the `archward` CLI read. This removes the duplicated,
  drift-prone copies that were hardcoded in the CLI and in the rule's default
  options.

  - `@archward/config` exports `defaults`, `resolveConfig`, `defineConfig`, and an
    async `loadConfig(cwd)` that discovers an optional
    `archward.config.{ts,js,mjs,cjs,json}` and merges it over the defaults.
  - The `adr` preset auto-loads the project's config, so its file glob and rule
    options always match what the generator emits.
  - The CLI resolves its sections, default status, and output directory from the
    same config. Resolution precedence is explicit flag > `archward.config` >
    built-in defaults, with new `--sections` / existing `--status` stopgap
    overrides. The `.adr-dir` marker file is superseded by `adr.dir`.

### Patch Changes

- Updated dependencies [069bbe3]
  - @archward/config@0.2.0

## 0.7.0

### Minor Changes

- c14c212: Rename from `@archward/ddd-eslint-plugin`, dropping the architecture prefix — one plugin per language with architectures as composed config (ADR-0014). The old package is deprecated and points here.

## 0.6.1

### Patch Changes

- 60438e0: Rebrand: this package is now published as `@archward/ddd-eslint-plugin` (formerly `@ddd-arch/eslint-plugin`, which is deprecated and points here). No API or behaviour change — only the package name, scope, and repository URLs.

## 0.6.0

### Minor Changes

- 86abcc5: Add `base/no-unclassified`: `configs.architecture` now denies every source file by default and allows only the roots, per-context modules, and layer files — so no file escapes the architecture. `composition/root` drops its root-file check (default-deny owns file placement) and keeps only module naming and location; a stray root file now reports as `base/no-unclassified` instead of `composition/root`. `configs.architecture` also gains `rootFiles` option (default `['main.ts', 'app.module.ts']`) to override which files may sit directly under the source root.

## 0.5.1

### Patch Changes

- 61a1e77: Ship `eslint-plugin-boundaries` as a direct dependency instead of a peer. The `architecture` preset imports it and passes the plugin object into the config, so it resolves from this package regardless of the consumer's node-modules layout — consumers no longer install it. Only `eslint-import-resolver-typescript` (loaded by name at lint time) remains a peer alongside `eslint`.

## 0.5.0

### Minor Changes

- b761a6c: Enforce inward layer dependencies in `configs.architecture` via eslint-plugin-boundaries: dependencies default to disallow and each layer may import only itself and the layers nested inside it (domain ← application ← infrastructure, presentation). The modular-monolith topology additionally isolates bounded contexts by confining every inward allowance to the same context. Adds `eslint-plugin-boundaries` and `eslint-import-resolver-typescript` as peer dependencies.

## 0.4.1

### Patch Changes

- e432a10: Internal refactor: flatten the architecture config entry to `configs/architecture.ts` (matching the rules' `<name>.ts` + `<name>/` convention) and split `resolveLayout` into per-field parsers. Also declare `README.md` explicitly in the package `files` list. No API or behavior change.

## 0.4.0

### Minor Changes

- 55abf21: Add the `composition/root` rule and wire it into `configs.architecture`. It enforces composition-root placement — only `main.ts` and `app.module.ts` directly under the source root, and, in a modular monolith, a `<context>.module.ts` named after each context folder. Name and position only; framework-specific file contents are not yet linted.

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
