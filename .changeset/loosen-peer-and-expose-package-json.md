---
'@ddd-arch/eslint-plugin': patch
---

Widen the `eslint` peer range to `^9.6.0 || ^10.0.0` — the plugin works on ESLint 9 (e.g. a `nest new` project), so requiring 10 was too strict. The 9.6.0 floor is set by the Languages API that the ADR/markdown config depends on. Also expose `./package.json` through the `exports` map for tooling that reads it.
