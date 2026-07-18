import { type CAC, cac } from 'cac';

import { GenerateAdr } from '../application/generate-adr';
import { InvalidInput } from '../domain/errors';
import { resolveAdrDir } from '../infrastructure/adr-dir';
import { FsAdrStore } from '../infrastructure/fs-adr-store';
import { type AdrCommandOptions, runAdrCommand } from './adr-command';

export interface RunDeps {
  cwd: string;
  version: string;
  out: (line: string) => void;
  err: (line: string) => void;
}

type RegisterGenerator = (cli: CAC, deps: RunDeps) => void;

const registerAdr: RegisterGenerator = (cli, deps) => {
  cli
    .command('adr <title>', 'Generate an Architecture Decision Record')
    .option('--date <date>', 'ISO date for the ADR (default: today)')
    .option('--status <status>', 'Initial status (default: Proposed)')
    .option('--json', 'Print the result as JSON')
    .action((title: string, options: AdrCommandOptions) => {
      const generate = new GenerateAdr(new FsAdrStore(resolveAdrDir(deps.cwd)));
      runAdrCommand({ type: 'adr', title, options, generate, out: deps.out });
    });
};

const GENERATORS: readonly RegisterGenerator[] = [registerAdr];

export function run(argv: string[], deps: RunDeps): number {
  const flags = argv.slice(2);
  if (flags.includes('-v') || flags.includes('--version')) {
    deps.out(deps.version);
    return 0;
  }
  try {
    const cli = buildCli(deps);
    cli.parse(argv);
    if (cli.options.help) {
      return 0;
    }
    if (!cli.matchedCommand) {
      const [command] = cli.args;
      if (command === undefined) {
        cli.outputHelp();
        return 0;
      }
      deps.err(`archward: unknown command '${command}'`);
      return 1;
    }
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
  for (const register of GENERATORS) {
    register(cli, deps);
  }
  cli.help();
  cli.version(deps.version);
  return cli;
}

const isUsageError = (error: unknown): error is Error =>
  error instanceof InvalidInput ||
  (error instanceof Error && error.name === 'CACError');
