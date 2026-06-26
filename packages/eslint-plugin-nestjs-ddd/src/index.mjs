import adrConfig from './configs/adr.mjs';
import adrStructure from './rules/adr-structure.mjs';
import noComments from './rules/base/no-comments.mjs';

const plugin = {
  meta: { name: 'eslint-plugin-nestjs-ddd', version: '0.0.0' },
  rules: { 'adr-structure': adrStructure, 'base/no-comments': noComments },
};

plugin.configs = { adr: adrConfig(plugin) };

export default plugin;
