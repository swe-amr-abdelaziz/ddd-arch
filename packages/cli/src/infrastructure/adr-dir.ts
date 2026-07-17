import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function resolveAdrDir(cwd: string): string {
  const marker = join(cwd, '.adr-dir');
  if (existsSync(marker)) {
    const configured = readFileSync(marker, 'utf8').trim();
    if (configured !== '') {
      return join(cwd, configured);
    }
  }
  return join(cwd, 'docs', 'decisions');
}
