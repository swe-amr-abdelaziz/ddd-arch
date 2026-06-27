import { readdirSync } from 'node:fs';

const dir = 'docs/decisions';
const numbers = readdirSync(dir)
  .filter((name) => /^\d{4}-.+\.md$/.test(name))
  .map((name) => Number(name.slice(0, 4)))
  .sort((a, b) => a - b);

const errors = [];
if (numbers.length === 0) {
  errors.push('no ADRs found in docs/decisions');
} else {
  if (numbers[0] !== 1) {
    errors.push(`numbering must start at 1, found ${numbers[0]}`);
  }
  for (let i = 1; i < numbers.length; i += 1) {
    if (numbers[i] === numbers[i - 1]) {
      errors.push(`duplicate ADR number ${numbers[i]}`);
    } else if (numbers[i] !== numbers[i - 1] + 1) {
      errors.push(`gap between ADR ${numbers[i - 1]} and ${numbers[i]}`);
    }
  }
}

if (errors.length > 0) {
  console.error('ADR numbering failed:');
  for (const line of errors) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `ADR numbering OK: ${numbers.length} ADRs, 1..${numbers[numbers.length - 1]}, no gaps.`,
);
