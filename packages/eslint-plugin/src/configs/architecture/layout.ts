import type { ResolvedLayout, Topology } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isTopology = (value: unknown): value is Topology =>
  value === 'microservice' || value === 'modular-monolith';

const isNonBlankString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isNonBlankString);

const parseTopology = (options: Record<string, unknown>): Topology => {
  const topology = options.topology;
  if (!isTopology(topology)) {
    throw new Error(
      `architecture: topology must be "microservice" or "modular-monolith", received ${JSON.stringify(topology)}.`,
    );
  }
  return topology;
};

const parseSourceRoot = (value: unknown): string => {
  const sourceRoot = value === undefined ? 'src' : value;
  if (!isNonBlankString(sourceRoot)) {
    throw new Error(
      `architecture: sourceRoot must be a non-empty, non-whitespace string, received ${JSON.stringify(sourceRoot)}.`,
    );
  }
  return sourceRoot;
};

const parseRootFiles = (value: unknown): string[] => {
  if (value === undefined) return ['main.ts', 'app.module.ts'];
  if (!isStringArray(value)) {
    throw new Error(
      `architecture: rootFiles must be an array of non-empty, non-whitespace strings, received ${JSON.stringify(value)}.`,
    );
  }
  return value;
};

export const resolveLayout = (options: unknown): ResolvedLayout => {
  if (!isRecord(options)) {
    throw new Error(
      `architecture: options must be an object, received ${JSON.stringify(options)}.`,
    );
  }

  const topology = parseTopology(options);
  const sourceRoot = parseSourceRoot(options.sourceRoot);
  const rootFiles = parseRootFiles(options.rootFiles);
  const root = topology === 'modular-monolith' ? `${sourceRoot}/*` : sourceRoot;

  return {
    topology,
    sourceRoot,
    rootFiles,
    layers: {
      domain: `${root}/domain/**`,
      application: `${root}/application/**`,
      infrastructure: `${root}/infrastructure/**`,
      presentation: `${root}/presentation/**`,
    },
  };
};
