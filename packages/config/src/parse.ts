import type { AdrConfig, ArchwardConfig } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') {
      return undefined;
    }
    out.push(item);
  }
  return out;
}

function numberRecord(value: unknown): Record<string, number> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const out: Record<string, number> = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== 'number') {
      return undefined;
    }
    out[key] = item;
  }
  return out;
}

export function toArchwardConfig(value: unknown): ArchwardConfig {
  if (!isRecord(value) || !isRecord(value.adr)) {
    return {};
  }
  const adr: AdrConfig = {
    sections: stringArray(value.adr.sections),
    statuses: stringArray(value.adr.statuses),
    maxLength: numberRecord(value.adr.maxLength),
    dir: typeof value.adr.dir === 'string' ? value.adr.dir : undefined,
  };
  return { adr };
}
