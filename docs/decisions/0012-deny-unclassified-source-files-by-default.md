# 12. Deny unclassified source files by default

Date: 2026-07-04

## Status

Accepted

## Context

The architecture rules so far assert specific facts — layer direction, module naming — but nothing guarantees the file set is exhaustive. A file in an unknown folder, or a new file type nobody declared, passes silently. A standard should be fail-closed: enumerate what is permitted and reject everything else. Under that stance `main.ts` and `app.module.ts` are not exceptions to carve out; they belong in the allowlist like every other file.

## Decision

Add the rule `base/no-unclassified`: it reports on every file under the source root. `configs.architecture` then turns it off for the allowed locations — the roots (`main.ts`, `app.module.ts`), a per-context module (modular monolith), and any file inside a layer — leaving everything else denied. This makes the preset an allowlist. `composition/root` drops its root-file check, since default-deny now owns which files may exist and where, and keeps only the relational checks a glob cannot express: a context module named after its folder, and modules only at composition-root locations.

## Consequences

No file escapes the architecture — a stray file at the root, a file in a context but outside a layer, or an unknown folder now errors. The allowlist starts coarse (any file inside a layer); the coming file-taxonomy slice narrows each layer to its permitted file types by adding patterns, so admitting a new type becomes a conscious allowlist edit rather than a silent addition. A non-conforming tree lints with errors until restructured — intended for a greenfield standard. The old `composition/root` root-file message is gone; that stray file now reports as `base/no-unclassified`.
