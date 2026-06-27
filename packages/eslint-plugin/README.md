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
];
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                   | Description                                                                                                                                                                  | 🔧  |
| :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-- |
| [base/adr-structure](docs/rules/base/adr-structure.md) | Enforce ADR structure: filename, an H1 title matching it, a valid date, the ordered sections, a status from the allowed set, no sub-headings, and per-section length limits. | 🔧  |
| [base/no-comments](docs/rules/base/no-comments.md)     | Disallow comments except tool directives and JSDoc type annotations; rationale belongs in commit messages, ADRs, or docs.                                                    |     |

<!-- end auto-generated rules list -->

Rules are exposed under the `arch/` namespace (e.g. `arch/base/adr-structure`) when you spread `configs.adr`.

## License

MIT © Amr Abdelaziz
