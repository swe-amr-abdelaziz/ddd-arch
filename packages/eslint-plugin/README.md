# @ddd-arch/eslint-plugin

Deterministic DDD + clean architecture ESLint rules for TypeScript backends. Framework-agnostic core.

## Install

```sh
pnpm add -D @ddd-arch/eslint-plugin
```

## Usage

```js
// eslint.config.mjs
import ddd from '@ddd-arch/eslint-plugin';

export default [
  ...ddd.configs.adr, // opt-in: lint docs/decisions/*.md
  ...ddd.configs.architecture({ topology: 'modular-monolith' }), // layer + context boundaries
];
```

The `architecture` preset enforces import direction with
[`eslint-plugin-boundaries`](https://github.com/javierbrea/eslint-plugin-boundaries)
(bundled — no action needed) and classifies TypeScript path aliases with
[`eslint-import-resolver-typescript`](https://github.com/import-js/eslint-import-resolver-typescript),
which you install as a peer and point at a resolvable `tsconfig`:

```sh
pnpm add -D eslint-import-resolver-typescript
```

`eslint-import-resolver-typescript` lists `eslint-plugin-import(-x)` as an
optional peer, so your package manager may print a peer warning if you have
neither — resolution works without them, so the warning is safe to ignore.

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                   | Description                                                                                                                                                                  | 🔧  |
| :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-- |
| [base/adr-structure](docs/rules/base/adr-structure.md) | Enforce ADR structure: filename, an H1 title matching it, a valid date, the ordered sections, a status from the allowed set, no sub-headings, and per-section length limits. | 🔧  |
| [base/no-comments](docs/rules/base/no-comments.md)     | Disallow comments except tool directives; rationale belongs in commit messages, ADRs, or docs.                                                                               |     |
| [composition/root](docs/rules/composition/root.md)     | Enforce composition-root placement: only main.ts and app.module.ts at the source root, and a context module named after each context folder.                                 |     |

<!-- end auto-generated rules list -->

Rules are exposed under the `arch/` namespace (e.g. `arch/base/adr-structure`) when you spread `configs.adr`.

## License

MIT © Amr Abdelaziz
