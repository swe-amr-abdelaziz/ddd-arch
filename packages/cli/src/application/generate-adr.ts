import { AdrDocument } from '../domain/adr-document';
import { AdrNumber } from '../domain/adr-number';
import type { AdrStore } from '../domain/adr-store';
import { AdrTitle } from '../domain/adr-title';

export interface GenerateAdrInput {
  title: string;
  date: string;
  status: string;
  sections: readonly string[];
}

export interface GeneratedAdr {
  path: string;
  contents: string;
}

export class GenerateAdr {
  constructor(private readonly store: AdrStore) {}

  execute(input: GenerateAdrInput): GeneratedAdr {
    const document = new AdrDocument({
      number: AdrNumber.next(this.store.existingNumbers()),
      title: AdrTitle.from(input.title),
      date: input.date,
      status: input.status,
      sections: input.sections,
    });
    const contents = document.render();
    const { path } = this.store.save(document.filename, contents);
    return { path, contents };
  }
}
