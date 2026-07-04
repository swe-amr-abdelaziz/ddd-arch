---
'@ddd-arch/eslint-plugin': minor
---

Enforce inward layer dependencies in `configs.architecture` via eslint-plugin-boundaries: dependencies default to disallow and each layer may import only itself and the layers nested inside it (domain ← application ← infrastructure, presentation). The modular-monolith topology additionally isolates bounded contexts by confining every inward allowance to the same context. Adds `eslint-plugin-boundaries` and `eslint-import-resolver-typescript` as peer dependencies.
