---
'@ddd-arch/eslint-plugin': patch
---

Internal refactor: flatten the architecture config entry to `configs/architecture.ts` (matching the rules' `<name>.ts` + `<name>/` convention) and split `resolveLayout` into per-field parsers. Also declare `README.md` explicitly in the package `files` list. No API or behavior change.
