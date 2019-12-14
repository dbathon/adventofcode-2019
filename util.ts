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

export function splitArray<T>(array: T[], splitLength: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += splitLength) {
    result.push(array.slice(i, i + splitLength));
  }
  return result;
}

export function findMax<T>(list: T[], toNumber: (t: T) => number): { max: number, maxElement: T } {
  let max = undefined;
  let maxElement = undefined;
  list.forEach(element => {
    const value = toNumber(element);
    if (typeof max === "undefined" || value > max) {
      max = value;
      maxElement = element;
    }
  });
  return { max, maxElement };
}
