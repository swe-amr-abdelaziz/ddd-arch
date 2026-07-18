import { join } from 'node:path';

import { loadConfig, type ResolvedAdrConfig } from '@archward/config';
import { type CAC, cac } from 'cac';

import { GenerateAdr } from '../application/generate-adr';
import { InvalidInput } from '../domain/errors';
import { FsAdrStore } from '../infrastructure/fs-adr-store';
import { type AdrCommandOptions, runAdrCommand } from './adr-command';

export interface RunDeps {
  cwd: string;
  version: string;
  out: (line: string) => void;
  err: (line: string) => void;
}

type RegisterGenerator = (
  cli: CAC,
  deps: RunDeps,
  config: ResolvedAdrConfig,
) => void;

const registerAdr: RegisterGenerator = (cli, deps, config) => {
  cli
    .command('adr <title>', 'Generate an Architecture Decision Record')
    .option('--date <date>', 'ISO date for the ADR (default: today)')
    .option('--status <status>', 'Initial status (default: first configured)')
    .option(
      '--sections <list>',
      'Comma-separated sections (default: configured)',
    )
    .option('--json', 'Print the result as JSON')
    .action((title: string, options: AdrCommandOptions) => {
      const store = new FsAdrStore(join(deps.cwd, config.dir));
      const generate = new GenerateAdr(store);
      runAdrCommand({
        type: 'adr',
        title,
        options,
        config,
        generate,
        out: deps.out,
      });
    });
};

const GENERATORS: readonly RegisterGenerator[] = [registerAdr];

export async function run(argv: string[], deps: RunDeps): Promise<number> {
  const flags = argv.slice(2);
  if (flags.includes('-v') || flags.includes('--version')) {
    deps.out(deps.version);
    return 0;
  }
  const config = (await loadConfig(deps.cwd)).adr;
  const cli = buildCli(deps, config);
  const commands = new Set(cli.commands.map((command) => command.name));
  if (!flags.some((token) => commands.has(token))) {
    return runGlobal(flags, cli, deps);
  }
  try {
    cli.parse(argv);
    if (cli.options.help) {
      return 0;
    }
    if (!cli.matchedCommand) {
      deps.err(`archward: ${unknownInput(flags)}`);
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

function runGlobal(flags: string[], cli: CAC, deps: RunDeps): number {
  const [only] = flags;
  if (flags.length === 0 || (flags.length === 1 && isHelpFlag(only))) {
    cli.outputHelp();
    return 0;
  }
  deps.err(`archward: ${unknownInput(flags)}`);
  return 1;
}

const isHelpFlag = (token: string | undefined): boolean =>
  token === '-h' || token === '--help';

function unknownInput(flags: string[]): string {
  const positional = flags.find((token) => !token.startsWith('-'));
  if (positional !== undefined) {
    return `unknown command '${positional}'`;
  }
  const flag = flags.find((token) => token.startsWith('-')) ?? flags[0] ?? '';
  return `unknown option '${flag}'`;
}

function buildCli(deps: RunDeps, config: ResolvedAdrConfig): CAC {
  const cli = cac('archward');
  for (const register of GENERATORS) {
    register(cli, deps, config);
  }
  cli.help();
  cli.version(deps.version);
  return cli;
}

const isUsageError = (error: unknown): error is Error =>
  error instanceof InvalidInput ||
  (error instanceof Error && error.name === 'CACError');
