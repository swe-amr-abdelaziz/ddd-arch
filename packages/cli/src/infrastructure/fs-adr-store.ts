import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { AdrStore, StoredAdr } from '../domain/adr-store';

const ADR_FILE = /^(\d{4,})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export class FsAdrStore implements AdrStore {
  constructor(private readonly dir: string) {}

  existingNumbers(): number[] {
    if (!existsSync(this.dir)) {
      return [];
    }
    return readdirSync(this.dir)
      .map((name) => ADR_FILE.exec(name))
      .filter((match): match is RegExpExecArray => match !== null)
      .map((match) => Number(match[1]));
  }

  save(filename: string, contents: string): StoredAdr {
    mkdirSync(this.dir, { recursive: true });
    const path = join(this.dir, filename);
    writeFileSync(path, contents);
    return { path };
  }
}
