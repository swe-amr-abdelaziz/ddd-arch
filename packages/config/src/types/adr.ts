export interface ResolvedAdrConfig {
  sections: string[];
  statuses: string[];
  maxLength: Record<string, number>;
  dir: string;
}

export type AdrConfig = Partial<ResolvedAdrConfig>;
