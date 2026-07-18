import type { ResolvedAdrConfig } from '@archward/config';

import type { GenerateAdr } from '../application/generate-adr';
import { InvalidInput } from '../domain/errors';

export interface AdrCommandOptions {
  date?: string;
  status?: string;
  sections?: string;
  json?: boolean;
}

interface AdrCommandRequest {
  type: string;
  title: string;
  options: AdrCommandOptions;
  config: ResolvedAdrConfig;
  generate: GenerateAdr;
  out: (line: string) => void;
}

export function runAdrCommand(request: AdrCommandRequest): void {
  const { type, title, options, config, generate, out } = request;
  if (type !== 'adr') {
    throw new InvalidInput(`Unknown generator "${type}". Available: adr.`);
  }
  const result = generate.execute({
    title,
    date: options.date ?? today(),
    status: options.status ?? config.statuses[0] ?? 'Proposed',
    sections: parseSections(options.sections) ?? config.sections,
  });
  out(
    options.json === true
      ? JSON.stringify({ path: result.path })
      : `✓ ${result.path}  (ddd · typescript)`,
  );
}

const parseSections = (value?: string): string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const parts = value
    .split(',')
    .map((section) => section.trim())
    .filter((section) => section !== '');
  return parts.length > 0 ? parts : undefined;
};

const today = (): string => new Date().toISOString().slice(0, 10);
