import { InvalidInput } from './errors';

export class Slug {
  private constructor(readonly value: string) {}

  static from(text: string): Slug {
    const value = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (value === '') {
      throw new InvalidInput(`"${text}" has no characters usable in a slug.`);
    }
    return new Slug(value);
  }
}
