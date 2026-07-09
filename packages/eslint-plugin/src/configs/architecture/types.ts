export type Topology = 'microservice' | 'modular-monolith';

type Layer = 'domain' | 'application' | 'infrastructure' | 'presentation';

export interface ArchitectureOptions {
  topology: Topology;
  sourceRoot?: string;
  rootFiles?: string[];
}

export interface ResolvedLayout {
  topology: Topology;
  sourceRoot: string;
  rootFiles: string[];
  layers: Record<Layer, string>;
}
