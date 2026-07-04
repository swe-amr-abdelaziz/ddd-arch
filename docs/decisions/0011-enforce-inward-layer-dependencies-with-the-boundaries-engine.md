# 11. Enforce inward layer dependencies with the boundaries engine

Date: 2026-07-04

## Status

Accepted

## Context

The topology preset names each layer folder and the composition-root rule locates the wiring, but nothing yet constrains how layers and bounded contexts import one another. Clean architecture requires dependencies to point inward: the domain must not know its application, infrastructure, or presentation. A modular monolith adds a second law — each bounded context owns its model and never reaches into another context's internals. Enforcing this over a resolved import graph is the province of a maintained engine; hand-rolling the traversal and path resolution would duplicate well-trodden work.

## Decision

`configs.architecture` adds a `dependency-direction` block built on eslint-plugin-boundaries. Each layer becomes a boundaries element derived from the topology globs; dependencies default to `disallow`, and a layer may import only itself and the layers nested inside it, domain inward-most. The modular-monolith topology captures the context and confines every inward allowance to the same context. Imports resolve through the TypeScript resolver, added with the engine as peer dependencies. A custom message states the inward law.

## Consequences

Layer direction and context isolation are enforced by a maintained engine rather than bespoke AST code, and the deny-by-default posture fails closed: a new layer or unlisted edge is rejected until explicitly allowed. Cross-context imports are forbidden outright; the single permitted cross-context edge — a published contract — arrives in a later slice once its location is fixed. Consumers must install the two peers and expose a resolvable tsconfig. Cycle detection stays a separate, topology-independent follow-up, as does content-level layer-import policy for module files.
