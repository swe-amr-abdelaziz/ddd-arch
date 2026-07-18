# @archward/cli

## 0.3.0

### Minor Changes

- 4d853d0: Give each generated element its own top-level command and help page. `archward g adr "<title>"` becomes `archward adr "<title>"`, and `archward adr --help` now shows an ADR-scoped usage page. Commands are driven by a single spec list, so each future element (aggregate, value object, event, …) registers a command and a cac-generated help page automatically.

  Also fixes the silent bare invocation (#35): `archward` with no command now prints usage and exits 0, while an unknown command prints `archward: unknown command '<x>'` and exits 1.

## 0.2.0

### Minor Changes

- dd21d54: Add `--version` / `-v` to the `archward` CLI, printing the installed `@archward/cli` version.

## 0.1.0

### Minor Changes

- b4f478b: Add the archward CLI with an ADR generator: `archward g adr "<title>"` scaffolds a conformant `docs/decisions/NNNN-<slug>.md`.
