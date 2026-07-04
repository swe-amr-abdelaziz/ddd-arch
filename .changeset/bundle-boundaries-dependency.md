---
'@ddd-arch/eslint-plugin': patch
---

Ship `eslint-plugin-boundaries` as a direct dependency instead of a peer. The `architecture` preset imports it and passes the plugin object into the config, so it resolves from this package regardless of the consumer's node-modules layout — consumers no longer install it. Only `eslint-import-resolver-typescript` (loaded by name at lint time) remains a peer alongside `eslint`.
