import type { AdrConfig, ResolvedAdrConfig } from './types/adr';

export type { AdrConfig, ResolvedAdrConfig };

export interface ResolvedArchwardConfig {
  adr: ResolvedAdrConfig;
}

export type ArchwardConfig = {
  [K in keyof ResolvedArchwardConfig]?: Partial<ResolvedArchwardConfig[K]>;
};
