import adrConfig from './configs/adr.mjs';
import adrStructure from './rules/adr-structure.mjs';

const plugin = {
  meta: { name: 'eslint-plugin-nestjs-ddd', version: '0.0.0' },
  rules: { 'adr-structure': adrStructure },
};

plugin.configs = { adr: adrConfig(plugin) };

export default plugin;
