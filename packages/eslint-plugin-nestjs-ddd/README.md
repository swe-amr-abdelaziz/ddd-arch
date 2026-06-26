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

| Rule | Description |
| --- | --- |
| [`arch/adr-structure`](./docs/rules/adr-structure.md) | Enforce ADR structure, sections, status, and per-section length limits. |

## License

MIT © Amr Abdelaziz
