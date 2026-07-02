import type { TSESLint } from '@typescript-eslint/utils';

import adrConfig from './configs/adr';
import architectureConfig from './configs/architecture';
import type { ArchitectureOptions } from './configs/architecture/types';
import baseRules from './rules/base/index';
import compositionRules from './rules/composition/index';

const plugin = {
  meta: { name: '@ddd-arch/eslint-plugin', version: '0.0.0' },
  rules: { ...baseRules, ...compositionRules },
} satisfies TSESLint.FlatConfig.Plugin;

export default {
  ...plugin,
  configs: {
    adr: adrConfig(plugin),
    architecture: (options: ArchitectureOptions) =>
      architectureConfig(plugin, options),
  },
};
