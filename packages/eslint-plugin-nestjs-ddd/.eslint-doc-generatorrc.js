import prettier from 'prettier';

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  ruleDocTitleFormat: 'name',
  ruleListColumns: ['name', 'description', 'fixable'],
  postprocess: async (content, path) => {
    const options = await prettier.resolveConfig(path);
    return prettier.format(content, { ...options, parser: 'markdown' });
  },
};

export default config;
