---
'@ddd-arch/eslint-plugin': minor
---

Add the `composition/root` rule and wire it into `configs.architecture`. It enforces composition-root placement — only `main.ts` and `app.module.ts` directly under the source root, and, in a modular monolith, a `<context>.module.ts` named after each context folder. Name and position only; framework-specific file contents are not yet linted.
