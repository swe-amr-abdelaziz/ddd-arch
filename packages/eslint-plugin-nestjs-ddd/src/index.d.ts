import type { Linter } from 'eslint';

declare const plugin: {
  meta: { name: string; version: string };
  rules: Record<string, unknown>;
  configs: { adr: Linter.Config[] };
};

export default plugin;
