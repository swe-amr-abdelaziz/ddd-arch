---
'@archward/cli': minor
---

Give each generated element its own top-level command and help page. `archward g adr "<title>"` becomes `archward adr "<title>"`, and `archward adr --help` now shows an ADR-scoped usage page. Commands are driven by a single spec list, so each future element (aggregate, value object, event, …) registers a command and a cac-generated help page automatically.

Also fixes the silent bare invocation (#35): `archward` with no command now prints usage and exits 0, while an unknown command prints `archward: unknown command '<x>'` and exits 1.
