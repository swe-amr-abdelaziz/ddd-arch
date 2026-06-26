# base/no-comments

📝 Disallow comments except tool directives and JSDoc type annotations; rationale belongs in commit messages, ADRs, or docs.

<!-- end auto-generated rule header -->

Disallow comments, with two exceptions: **tool directives** and **JSDoc type annotations**. Rationale belongs in commit messages, ADRs, or docs — not in the code, where it drifts out of sync with what it describes and is rarely read.

## What it allows

- **Tool directives** — `eslint*` / `eslint-disable*`, `global`, `globals`, `exported`, and the TypeScript pragmas `@ts-check`, `@ts-expect-error`, `@ts-ignore`, `@ts-nocheck`. These are machine-read instructions, not prose.
- **JSDoc type annotations** — a `/** … */` block that starts with `*` and carries an `@`-tag (`@type`, `@param`, `@returns`, `@typedef`, `@satisfies`, …). This keeps `@ts-check` type hints working in build-free `.mjs` files.

## What it rejects

Everything else: line comments (`// note`), plain block comments (`/* note */`), and **tag-less** JSDoc (`/** just prose */`) — a JSDoc block with no `@`-tag is prose, not a type.

## Options

### `allow`

An array of regular-expression patterns, tested against each comment's trimmed text. A comment that matches any of them is allowed — an escape hatch for project conventions such as `TODO`/`FIXME` markers:

```js
'arch/base/no-comments': ['error', { allow: ['^TODO', '^FIXME'] }];
```

## Why

Comments are unversioned claims about code that no test enforces; they rot. A decision worth recording is an ADR; a rationale worth keeping is a commit message; everything else should be expressed in names and structure.

## Examples

```js
// validate the input        ← rejected (prose)
/* TODO: revisit */          ← rejected (prose)
/** the user id */           ← rejected (tag-less JSDoc)

// @ts-check                 ← allowed (directive)
/** @type {number} */        ← allowed (type annotation)
```
