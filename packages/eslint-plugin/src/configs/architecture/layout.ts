import type { ResolvedLayout, Topology } from './types';

const isTopology = (value: unknown): value is Topology =>
  value === 'microservice' || value === 'modular-monolith';

const parseTopology = (options: object): Topology => {
  const topology = 'topology' in options ? options.topology : undefined;
  if (!isTopology(topology)) {
    throw new Error(
      `architecture: topology must be "microservice" or "modular-monolith", received ${JSON.stringify(topology)}.`,
    );
  }
  return topology;
};

const parseSourceRoot = (options: object): string => {
  const sourceRoot =
    'sourceRoot' in options && options.sourceRoot !== undefined
      ? options.sourceRoot
      : 'src';
  if (typeof sourceRoot !== 'string' || sourceRoot.trim() === '') {
    throw new Error(
      `architecture: sourceRoot must be a non-empty, non-whitespace string, received ${JSON.stringify(sourceRoot)}.`,
    );
  }
  return sourceRoot;
};

export const resolveLayout = (options: unknown): ResolvedLayout => {
  if (typeof options !== 'object' || options === null) {
    throw new Error(
      `architecture: options must be an object, received ${JSON.stringify(options)}.`,
    );
  }

  const topology = parseTopology(options);
  const sourceRoot = parseSourceRoot(options);
  const root = topology === 'modular-monolith' ? `${sourceRoot}/*` : sourceRoot;

  return {
    topology,
    sourceRoot,
    layers: {
      domain: `${root}/domain/**`,
      application: `${root}/application/**`,
      infrastructure: `${root}/infrastructure/**`,
      presentation: `${root}/presentation/**`,
    },
  };
};
