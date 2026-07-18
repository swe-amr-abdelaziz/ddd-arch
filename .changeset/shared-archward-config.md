---
'@archward/config': minor
'@archward/eslint-plugin': minor
'@archward/cli': minor
---

Share one `archward.config` between the linter and the generator.

The ADR spec (sections, statuses, per-section `maxLength`, and the ADR
directory) now lives in a single new package, `@archward/config`, that both the
ESLint `adr` preset and the `archward` CLI read. This removes the duplicated,
drift-prone copies that were hardcoded in the CLI and in the rule's default
options.

- `@archward/config` exports `defaults`, `resolveConfig`, `defineConfig`, and an
  async `loadConfig(cwd)` that discovers an optional
  `archward.config.{ts,js,mjs,cjs,json}` and merges it over the defaults.
- The `adr` preset auto-loads the project's config, so its file glob and rule
  options always match what the generator emits.
- The CLI resolves its sections, default status, and output directory from the
  same config. Resolution precedence is explicit flag > `archward.config` >
  built-in defaults, with new `--sections` / existing `--status` stopgap
  overrides. The `.adr-dir` marker file is superseded by `adr.dir`.
