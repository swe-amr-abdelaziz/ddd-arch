# @archward/config

One shared config read by the [`@archward/eslint-plugin`](https://www.npmjs.com/package/@archward/eslint-plugin) linter and the [`@archward/cli`](https://www.npmjs.com/package/@archward/cli) generator, so a generated file passes the same project's rules by construction. Part of [Archward](https://github.com/archward).

## Install

```bash
pnpm add -D @archward/config
```

## Usage

Create an `archward.config.{ts,js,mjs,cjs,json}` at your project root. `defineConfig` gives you typed autocompletion:

```ts
import { defineConfig } from '@archward/config';

export default defineConfig({
  adr: {
    dir: 'docs/decisions',
    sections: ['Status', 'Context', 'Decision', 'Consequences'],
    statuses: ['Proposed', 'Accepted', 'Rejected', 'Deprecated'],
    maxLength: {
      Title: 80,
      Status: 120,
      Context: 600,
      Decision: 600,
      Consequences: 600,
    },
  },
});
```

Every field is optional; anything you omit falls back to the built-in defaults. Both the ESLint `adr` preset and the CLI read this one file, so their view of the ADR spec never drifts. Resolution precedence is explicit CLI flag, then `archward.config`, then defaults.

A JSON config needs no import:

```json
{
  "adr": {
    "dir": "docs/decisions",
    "statuses": ["Proposed", "Accepted", "Rejected", "Deprecated"]
  }
}
```

## API

| Export                    | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `defineConfig(config)`    | Identity helper that types a config file for autocomplete. |
| `loadConfig(cwd)`         | Discover and resolve the project config (async).           |
| `resolveConfig(partial?)` | Merge a partial config over the defaults.                  |
| `defaults`                | The built-in resolved config.                              |
| `ArchwardConfig`          | The input config shape (every field optional).             |
| `ResolvedArchwardConfig`  | The fully-resolved config shape.                           |

## License

MIT © Amr Abdelaziz
