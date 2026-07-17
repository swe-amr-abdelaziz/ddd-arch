import type { AdrNumber } from './adr-number';
import type { AdrTitle } from './adr-title';

interface AdrParts {
  number: AdrNumber;
  title: AdrTitle;
  date: string;
  status: string;
  sections: readonly string[];
}

const GUIDANCE: Record<string, string> = {
  Context:
    'The issue motivating this decision and any context that constrains it.',
  Decision: 'The change we are proposing or have agreed to implement.',
  Consequences:
    'What becomes easier or harder, and any risks the change introduces.',
};

export class AdrDocument {
  constructor(private readonly parts: AdrParts) {}

  get filename(): string {
    const { number, title } = this.parts;
    return `${number.padded}-${title.slug.value}.md`;
  }

  render(): string {
    const { number, title, date, sections } = this.parts;
    const header = `# ${number.display}. ${title.text}\n\nDate: ${date}\n`;
    return header + sections.map((name) => this.section(name)).join('');
  }

  private section(name: string): string {
    const body =
      name === 'Status' ? this.parts.status : AdrDocument.placeholder(name);
    return `\n## ${name}\n\n${body}\n`;
  }

  private static placeholder(name: string): string {
    return `<!-- ${GUIDANCE[name] ?? 'Describe this section.'} -->`;
  }
}
