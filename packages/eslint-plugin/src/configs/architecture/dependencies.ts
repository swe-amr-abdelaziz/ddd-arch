import type { TSESLint } from '@typescript-eslint/utils';
import boundaries from 'eslint-plugin-boundaries';

import type { ResolvedLayout } from './types';

const INWARD: Record<string, string[]> = {
  domain: ['domain'],
  application: ['application', 'domain'],
  infrastructure: ['infrastructure', 'application', 'domain'],
  presentation: ['presentation', 'application', 'domain'],
};

const SAME_CONTEXT = { context: '{{from.captured.context}}' };

const violationMessage = (layout: ResolvedLayout): string => {
  const inward =
    'a {{from.type}} file cannot import {{to.type}}: inside a bounded context ' +
    'dependencies point inward (domain <- application <- infrastructure, presentation)';
  return layout.topology === 'modular-monolith'
    ? `${inward}, and bounded contexts integrate only through published contracts.`
    : `${inward}.`;
};

const elements = (layout: ResolvedLayout) => {
  const nested = layout.topology === 'modular-monolith';
  return Object.entries(layout.layers).map(([type, pattern]) => ({
    type,
    pattern,
    mode: 'full',
    ...(nested ? { capture: ['context', 'internal'] } : {}),
  }));
};

const dependencyRules = (layout: ResolvedLayout) => {
  const nested = layout.topology === 'modular-monolith';
  return Object.entries(INWARD).map(([from, to]) => ({
    from: { type: from },
    allow: { to: { type: to, ...(nested ? { captured: SAME_CONTEXT } : {}) } },
  }));
};

export const dependencyDirection = (
  layout: ResolvedLayout,
): TSESLint.FlatConfig.Config => ({
  name: 'ddd/architecture/dependency-direction',
  files: [`${layout.sourceRoot}/**/*.ts`],
  plugins: { boundaries },
  settings: {
    'import/resolver': { typescript: true },
    'boundaries/elements': elements(layout),
  },
  rules: {
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        message: violationMessage(layout),
        rules: dependencyRules(layout),
      },
    ],
  },
});
