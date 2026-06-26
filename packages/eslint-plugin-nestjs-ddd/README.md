# eslint-plugin-nestjs-ddd

Deterministic DDD and clean-architecture ESLint rules for NestJS projects.

## Install

```sh
pnpm add -D eslint-plugin-nestjs-ddd
```

## Usage

```js
// eslint.config.mjs
import nestjsDdd from 'eslint-plugin-nestjs-ddd';

export default [
  ...nestjsDdd.configs.adr, // opt-in: lint docs/decisions/*.md
];
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                         | Description                                                                                                                                                                  | 🔧 |
| :------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :- |
| [adr-structure](docs/rules/adr-structure.md) | Enforce ADR structure: filename, an H1 title matching it, a valid date, the ordered sections, a status from the allowed set, no sub-headings, and per-section length limits. | 🔧 |

<!-- end auto-generated rules list -->

Rules are exposed under the `arch/` namespace (e.g. `arch/adr-structure`) when you spread `configs.adr`.

## License

MIT © Amr Abdelaziz
