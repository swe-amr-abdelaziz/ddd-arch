# @archward/cli

The `archward` CLI scaffolds architecture-conformant files that pass the [`@archward/eslint-plugin`](https://www.npmjs.com/package/@archward/eslint-plugin) rules. Part of [Archward](https://github.com/archward).

## Install

```bash
pnpm add -D @archward/cli
```

## Usage

```bash
archward adr "<title>" [--date YYYY-MM-DD] [--status <status>] [--json]
```

Writes `docs/decisions/NNNN-<slug>.md` — a structurally complete ADR (contiguous number, sentence-case title, date, ordered sections). The generator constructs; the linter validates. Body sections are emitted as prompts, so ESLint reports exactly the sections you still need to write.

## License

MIT © Amr Abdelaziz
