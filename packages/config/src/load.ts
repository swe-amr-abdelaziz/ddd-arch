import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { createJiti } from 'jiti';

import { toArchwardConfig } from './parse';
import { resolveConfig } from './resolve';
import type { ResolvedArchwardConfig } from './types';

const CONFIG_EXTENSIONS = ['ts', 'mts', 'js', 'mjs', 'cjs', 'json'];

export async function loadConfig(cwd: string): Promise<ResolvedArchwardConfig> {
  for (const ext of CONFIG_EXTENSIONS) {
    const path = join(cwd, `archward.config.${ext}`);
    if (existsSync(path)) {
      const jiti = createJiti(import.meta.url);
      const loaded = await jiti.import(path, { default: true });
      return resolveConfig(toArchwardConfig(loaded));
    }
  }
  return resolveConfig();
}
