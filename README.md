# NestJS DDD Conventions

Deterministic DDD + clean/onion architecture conventions for NestJS, enforced by ESLint. Opinionated by design: the rules remove architectural choices so a project's structure stays consistent — and machine-checkable — across teams and AI agents.

## Packages

| Package                    | Kind          | Purpose                                           |
| -------------------------- | ------------- | ------------------------------------------------- |
| `eslint-plugin-nestjs-ddd` | devDependency | the `arch/*` rules + composed flat configs        |
| `nestjs-ddd-kernel`        | dependency    | framework-free DDD base classes the rules enforce |
| `nestjs-ddd-adapters`      | dependency    | NestJS adapters for the kernel                    |

## License

MIT © Amr Abdelaziz
