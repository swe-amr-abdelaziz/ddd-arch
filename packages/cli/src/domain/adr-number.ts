export class AdrNumber {
  private constructor(readonly value: number) {}

  static next(existing: readonly number[]): AdrNumber {
    const highest = existing.reduce(
      (max, current) => Math.max(max, current),
      0,
    );
    return new AdrNumber(highest + 1);
  }

  get padded(): string {
    return String(this.value).padStart(4, '0');
  }

  get display(): string {
    return String(this.value);
  }
}
