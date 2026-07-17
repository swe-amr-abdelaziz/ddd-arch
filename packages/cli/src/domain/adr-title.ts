import { Slug } from './slug';

export class AdrTitle {
  private constructor(
    readonly text: string,
    readonly slug: Slug,
  ) {}

  static from(raw: string): AdrTitle {
    const cleaned = stripTrailingDots(raw.trim());
    const text = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return new AdrTitle(text, Slug.from(text));
  }
}

function stripTrailingDots(value: string): string {
  let end = value.length;
  while (end > 0 && value.charAt(end - 1) === '.') {
    end -= 1;
  }
  return value.slice(0, end).trimEnd();
}
