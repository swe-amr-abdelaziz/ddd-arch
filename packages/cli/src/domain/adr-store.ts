export interface StoredAdr {
  path: string;
}

export interface AdrStore {
  existingNumbers(): number[];
  save(filename: string, contents: string): StoredAdr;
}
