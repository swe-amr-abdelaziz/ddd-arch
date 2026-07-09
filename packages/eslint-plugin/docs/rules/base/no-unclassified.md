# base/no-unclassified

📝 Deny every source file by default; an allowed pattern must turn this rule off, so no file escapes the architecture.

<!-- end auto-generated rule header -->

The architecture is an **allowlist**, not a denylist. This rule reports on _every_ file under the source root; `configs.architecture` then turns it off for the locations the standard permits. A file that matches no allowed pattern stays reported — so nothing slips into the tree unclassified.

## What it enforces

With `configs.architecture`, a source file is allowed only when it is one of:

- one of the root files, `<sourceRoot>/main.ts` and `<sourceRoot>/app.module.ts` by default — override with the `rootFiles` option of `configs.architecture` (e.g. `['index.ts']`, or extra names like a worker entrypoint)
- a per-context module `<sourceRoot>/<context>/<context>.module.ts` (modular monolith)
- a file inside a layer: `<sourceRoot>/<context>/{domain,application,infrastructure,presentation}/**` (or without the `<context>` segment for a microservice)

Anything else — a stray file at the source root, a file in a context but outside a layer, a file in an unknown folder — is rejected. The rule takes no options; the allowed patterns are supplied by `configs.architecture`.

## Why

Fail-closed beats fail-open. Enumerating what is permitted means a new file type cannot appear without a conscious decision to allow it, which is what keeps the file taxonomy exhaustive as it grows. This rule owns _which files may exist and where_; `composition/root` owns the one relational check a glob cannot express — that a context module is named after its folder.
