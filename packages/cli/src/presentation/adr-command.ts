import type { GenerateAdr } from '../application/generate-adr';
import { ADR_SECTIONS, ADR_STATUSES } from '../domain/adr-spec';
import { InvalidInput } from '../domain/errors';

export interface AdrCommandOptions {
  date?: string;
  status?: string;
  json?: boolean;
}

interface AdrCommandRequest {
  type: string;
  title: string;
  options: AdrCommandOptions;
  generate: GenerateAdr;
  out: (line: string) => void;
}

const DEFAULT_STATUS = ADR_STATUSES[0] ?? 'Proposed';

export function runAdrCommand(request: AdrCommandRequest): void {
  const { type, title, options, generate, out } = request;
  if (type !== 'adr') {
    throw new InvalidInput(`Unknown generator "${type}". Available: adr.`);
  }
  const result = generate.execute({
    title,
    date: options.date ?? today(),
    status: options.status ?? DEFAULT_STATUS,
    sections: ADR_SECTIONS,
  });
  out(
    options.json === true
      ? JSON.stringify({ path: result.path })
      : `✓ ${result.path}  (ddd · typescript)`,
  );
}

const today = (): string => new Date().toISOString().slice(0, 10);
