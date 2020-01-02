import { readLines, sum, p } from './util/util';

const numbers = readLines('input/a01.txt').map(str => parseInt(str));

p(numbers);

function fuel(input: number) {
  return Math.max(Math.floor(input / 3) - 2, 0);
}

p(sum(numbers.map(fuel)));

function fuelRec(input: number): number {
  let result = fuel(input);
  return result <= 0 ? 0 : result + fuelRec(result);
}

p(sum(numbers.map(fuelRec)));
