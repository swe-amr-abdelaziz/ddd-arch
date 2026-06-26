# 3. Lint and document rules with dedicated tooling

Date: 2026-06-26

## Status

Accepted

## Context

As the plugin grows toward many rules, two failure modes compound: our rule definitions drift from ESLint's authoring conventions (missing `meta`, unsafe fixers), and the rule docs fall out of sync with the code. Both are mechanical to verify yet easy to neglect by hand.

## Decision

Lint our own rule sources under `src/rules/` with `eslint-plugin-eslint-plugin` (flat `recommended`), and generate the derived rule-doc headers and the README rules table with `eslint-doc-generator`, verified by `--check`. Hand-written prose stays below the generated markers. Acting on the linter's first findings, each rule declares `meta.defaultOptions`, so option defaults live in one tooling-visible place instead of being merged by hand.

## Consequences

Rule-authoring mistakes surface as lint errors rather than runtime bugs, and the docs can no longer drift undetected. The cost is two dev dependencies (plus Prettier, used only to format generated tables) and a CI gate. The config-membership badge is omitted for now because our `arch/` namespace differs from the package-derived prefix the generator expects; revisit once multiple presets exist.
