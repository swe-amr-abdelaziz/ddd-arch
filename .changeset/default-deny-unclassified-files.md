---
'@ddd-arch/eslint-plugin': minor
---

Add `base/no-unclassified`: `configs.architecture` now denies every source file by default and allows only the roots, per-context modules, and layer files — so no file escapes the architecture. `composition/root` drops its root-file check (default-deny owns file placement) and keeps only module naming and location; a stray root file now reports as `base/no-unclassified` instead of `composition/root`. `configs.architecture` also gains `rootFiles` option (default `['main.ts', 'app.module.ts']`) to override which files may sit directly under the source root.
