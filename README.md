# ddd-arch

Deterministic DDD + clean architecture conventions for TypeScript backends, enforced by ESLint. Framework-agnostic core. Opinionated by design: the rules remove architectural choices so a project's structure stays consistent — and machine-checkable — across teams and AI agents.

## Packages

| Package                   | Kind          | Purpose                                                     |
| ------------------------- | ------------- | ----------------------------------------------------------- |
| `@ddd-arch/eslint-plugin` | devDependency | the `arch/*` rules + composed flat configs                  |
| `@ddd-arch/kernel`        | dependency    | framework-free DDD base classes the rules enforce           |
| `@ddd-arch/nestjs`        | dependency    | thin NestJS runtime bridges (event publisher, error filter) |

## License

MIT © Amr Abdelaziz
