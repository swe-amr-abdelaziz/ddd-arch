import adrConfig from './configs/adr.mjs';
import baseRules from './rules/base/index.mjs';

const plugin = {
  meta: { name: 'eslint-plugin-nestjs-ddd', version: '0.0.0' },
  rules: {
    ...baseRules,
  },
};

plugin.configs = { adr: adrConfig(plugin) };

export default plugin;
