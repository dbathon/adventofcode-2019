import { p, readLines, sum } from "./util/util";

const input = readLines("input/a16.txt")[0].split("").map(str => parseInt(str));

const BASE_PATTERN = [0, 1, 0, -1];

function getPatternDigit(index: number, outDigit: number) {
  return BASE_PATTERN[(Math.floor((index + 1) / (outDigit + 1)) % BASE_PATTERN.length)];
}

function fft(input: number[], iterations: number) {
  let cur = input;
  for (let i = 0; i < iterations; ++i) {
    cur = cur.map((_, outDigit) => {
      return Math.abs(sum(cur.map((inDigit, index) => inDigit * getPatternDigit(index, outDigit)))) % 10;
    });
  }
  return cur;
}

function fftFast(input: number[], iterations: number, startOutDigit: number) {
  const length = input.length;
  let cur = input.slice(0);
  let next = input.slice(0);
  if (startOutDigit < length / 2) {
    throw "startOutDigit too small";
  }
  for (let i = 0; i < iterations; ++i) {
    let sum = 0;
    for (let outDigit = length - 1; outDigit >= startOutDigit; --outDigit) {
      sum = (sum + cur[outDigit]) % 10;
      next[outDigit] = Math.abs(sum);
    }

    // just swap the two arrays
    let tmp = cur;
    cur = next;
    next = tmp;
  }
  return cur;
}

p(fft(input, 100).join("").substr(0, 8));

const realInput: number[] = [];
for (let i = 0; i < 10000; ++i) {
  realInput.splice(realInput.length, 0, ...input);
}
const messageOffset = parseInt(input.join("").substr(0, 7));
p(messageOffset);
p(realInput.length);
p(fftFast(realInput, 100, messageOffset).join("").substr(messageOffset, 8));
