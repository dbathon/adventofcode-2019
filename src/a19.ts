import { IntCodeComputer } from "./util/intCodeComputer";
import { readLines, p } from "./util/util";
import { Map2D } from "./util/map2D";

const memory = readLines("input/a19.txt")[0].split(",").map(str => parseInt(str));

const map: Map2D<string> = new Map2D();

let cnt = 0;

for (let x = 0; x < 50; ++x) {
  for (let y = 0; y < 50; ++y) {
    const computer = new IntCodeComputer(memory);
    computer.input.push(x);
    computer.input.push(y);
    computer.runUntilOutputOrHalt();
    cnt += computer.lastOutput;
    map.set(x, y, computer.lastOutput === 1 ? "#" : ".");
  }
}

p(map.draw());
p(cnt);

// part 2

const squareWidth = 99;
const scanStart = 10;

let minX = 0;
let minWidth = 0;
let endXForY: number[] = [];
outer: for (let y = scanStart; y < 2000; ++y) {
  let x = minX;
  let startX = -1;
  let endX = -1;
  while (endX < 0) {
    const computer = new IntCodeComputer(memory);
    computer.input.push(x);
    computer.input.push(y);
    computer.runUntilOutputOrHalt();
    let pull = computer.lastOutput === 1;
    if (startX < 0 && pull) {
      if (y > scanStart + squareWidth && endXForY[y - squareWidth] - x >= squareWidth) {
        p(x * 10000 + (y - squareWidth));
        break outer;
      }
      startX = x;
      x += Math.max(1, minWidth - 1);
    }
    else if (startX >= 0 && !pull) {
      endX = x - 1;
      minWidth = (endX - startX) - 1;
      endXForY[y] = endX;
      // p([y, startX, endX]);
    }
    else {
      ++x;
    }
  }
}
