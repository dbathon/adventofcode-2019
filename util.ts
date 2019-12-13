import { readFileSync } from 'fs';

export function readLines(path: string) {
  const input = readFileSync(path).toString();
  return input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

export function sum(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0);
}

export function p(input: any) {
  console.log(JSON.stringify(input));
}
