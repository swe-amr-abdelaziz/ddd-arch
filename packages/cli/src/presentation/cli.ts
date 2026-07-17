import { type CAC, cac } from 'cac';

import { GenerateAdr } from '../application/generate-adr';
import { InvalidInput } from '../domain/errors';
import { resolveAdrDir } from '../infrastructure/adr-dir';
import { FsAdrStore } from '../infrastructure/fs-adr-store';
import { type AdrCommandOptions, runAdrCommand } from './adr-command';

export interface RunDeps {
  cwd: string;
  out: (line: string) => void;
  err: (line: string) => void;
}

export function run(argv: string[], deps: RunDeps): number {
  try {
    buildCli(deps).parse(argv);
    return 0;
  } catch (error) {
    if (!isUsageError(error)) {
      throw error;
    }
    deps.err(`archward: ${error.message}`);
    return 1;
  }
}

function buildCli(deps: RunDeps): CAC {
  const cli = cac('archward');
  cli
    .command(
      'g <type> <title>',
      'Generate an architecture artifact (type: adr)',
    )
    .option('--date <date>', 'ISO date for the ADR (default: today)')
    .option('--status <status>', 'Initial status (default: Proposed)')
    .option('--json', 'Print the result as JSON')
    .action((type: string, title: string, options: AdrCommandOptions) => {
      const generate = new GenerateAdr(new FsAdrStore(resolveAdrDir(deps.cwd)));
      runAdrCommand({ type, title, options, generate, out: deps.out });
    });
  cli.help();
  return cli;
}

const isUsageError = (error: unknown): error is Error =>
  error instanceof InvalidInput ||
  (error instanceof Error && error.name === 'CACError');
