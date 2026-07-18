import { defaults } from './defaults';
import type { ArchwardConfig, ResolvedArchwardConfig } from './types';

export function defineConfig(config: ArchwardConfig): ArchwardConfig {
  return config;
}

export function resolveConfig(
  partial?: ArchwardConfig,
): ResolvedArchwardConfig {
  const adr = partial?.adr ?? {};
  return {
    adr: {
      sections: adr.sections ?? defaults.adr.sections,
      statuses: adr.statuses ?? defaults.adr.statuses,
      maxLength: adr.maxLength ?? defaults.adr.maxLength,
      dir: adr.dir ?? defaults.adr.dir,
    },
  };
}
