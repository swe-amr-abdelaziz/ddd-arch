# Archward — DDD for TypeScript

Deterministic DDD + clean architecture conventions for TypeScript backends, enforced by ESLint. Framework-agnostic core. Opinionated by design: the rules remove architectural choices so a project's structure stays consistent — and machine-checkable — across teams and AI agents. Part of [Archward](https://github.com/archward) — the same standard, enforced across languages.

## Packages

| Package                   | Kind          | Purpose                                                     |
| ------------------------- | ------------- | ----------------------------------------------------------- |
| `@archward/eslint-plugin` | devDependency | the `arch/*` rules + composed flat configs                  |
| `@archward/kernel`        | dependency    | framework-free DDD base classes the rules enforce           |
| `@archward/nestjs`        | dependency    | thin NestJS runtime bridges (event publisher, error filter) |
| `@archward/cli`           | devDependency | the `archward` CLI — scaffolds conformant files (ADRs, …)   |

## Roadmap

Each type ships as a bundle — **rule + test + doc** — and a matching **generator** (`@archward/cli`) co-developed with it. `✅` shipped · `⬜` planned · `—` not applicable.

### Rules & generators

| Type                                                                                        | Rule | Test | Doc | Generator |
| :------------------------------------------------------------------------------------------ | :--: | :--: | :-: | :-------: |
| **Foundations**                                                                             |      |      |     |           |
| `base/adr-structure`                                                                        |  ✅  |  ✅  | ✅  |    ✅     |
| `base/no-comments`                                                                          |  ✅  |  ✅  | ✅  |     —     |
| `base/no-unclassified`                                                                      |  ✅  |  ✅  | ✅  |     —     |
| `composition/root`                                                                          |  ✅  |  ✅  | ✅  |    ⬜     |
| **Domain** — `src/<context>/domain/`                                                        |      |      |     |           |
| value object                                                                                |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| entity                                                                                      |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| aggregate (root)                                                                            |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| domain event                                                                                |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| domain error                                                                                |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| enum                                                                                        |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| constants                                                                                   |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| specification                                                                               |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| domain service                                                                              |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| repository port                                                                             |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| **Application** — `src/<context>/application/`                                              |      |      |     |           |
| command (+ handler)                                                                         |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| query (+ handler)                                                                           |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| DTO — command / query / result                                                              |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| policy                                                                                      |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| port                                                                                        |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| application error                                                                           |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| **Presentation** — `src/<context>/presentation/` · _driving adapters (call a use-case)_     |      |      |     |           |
| HTTP / REST controller                                                                      |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| GraphQL resolver                                                                            |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| gRPC handler (server)                                                                       |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| CLI command                                                                                 |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| webhook receiver                                                                            |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| message / event consumer                                                                    |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| scheduled / cron trigger                                                                    |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| WebSocket / SSE gateway (inbound)                                                           |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| **Infrastructure** — `src/<context>/infrastructure/` · _driven adapters (implement a port)_ |      |      |     |           |
| repository (persistence)                                                                    |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| cache adapter                                                                               |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| external service / API client                                                               |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| gRPC client                                                                                 |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| message / event publisher                                                                   |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| realtime push (notification port)                                                           |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| blob / file storage                                                                         |  ⬜  |  ⬜  | ⬜  |    ⬜     |
| mail / notification sender                                                                  |  ⬜  |  ⬜  | ⬜  |    ⬜     |

Each layer also gets a **barrel** and an **allowed-imports** rule; adapters carry their own DTOs and mappers. Presentation holds **driving** adapters (they call a use-case); infrastructure holds **driven** adapters (they implement a port).

### Beyond the rules

- [x] Architecture preset (`configs.architecture`) — topology, dependency direction, default-deny
- [ ] Cross-context contracts — published language + integration events + consumer ACL
- [ ] `@archward/config` — one config shared by the linter and the generator
- [x] `@archward/cli` (`archward g <type> <name>`) — ADR generator shipped with a generate → lint test; more types co-developed per taxonomy
- [ ] `@archward/kernel` — `AggregateRoot`, `Entity`, `ValueObject`, `DomainEvent`, …
- [ ] `@archward/nestjs` — event publisher + error filter bridges
- [ ] Beyond TypeScript — the same standard in other languages (own organization)

## License

MIT © Amr Abdelaziz
