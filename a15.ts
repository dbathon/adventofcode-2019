import { IntCodeComputer } from './intCodeComputer';
import { readLines, p, Map2D } from './util';

const memory = readLines('input/a15.txt')[0].split(",").map(str => parseInt(str));

const EMPTY = ".";
const WALL = "#";
const OXYGEN = "O";

class Direction {
  constructor(readonly command: number, readonly xOffset: number, readonly yOffset: number) { }
}

const DIRECTIONS = [
  new Direction(1, 0, -1),
  new Direction(2, 0, 1),
  new Direction(3, -1, 0),
  new Direction(4, 1, 0)
];

class State {
  constructor(readonly computer: IntCodeComputer, readonly path: number[], readonly x: number, readonly y: number) { }
}

const queue: State[] = [
  new State(new IntCodeComputer(memory), [], 0, 0)
];

const map: Map2D<string> = new Map2D();
map.set(0, 0, EMPTY);

while (queue.length > 0) {
  const state = queue.shift();
  DIRECTIONS.forEach(direction => {
    const newX = state.x + direction.xOffset;
    const newY = state.y + direction.yOffset;
    if (map.get(newX, newY) === undefined) {
      const computer = state.computer.copy();
      computer.input.push(direction.command);
      computer.runUntilOutputOrHalt();
      const result = computer.lastOutput;
      if (result === 0) {
        // wall
        map.set(newX, newY, WALL);
      }
      else if (result === 1 || result === 2) {
        // free space or oxygen
        map.set(newX, newY, result === 1 ? EMPTY : OXYGEN);
        const newPath = [...state.path, direction.command];
        if (result === 2) {
          p("path length: " + newPath.length);
        }
        queue.push(new State(computer, newPath, newX, newY));
      }
      else {
        throw "unexpected result: " + result;
      }
    }
  });
}

p(map.draw());

// part2
let oxyMap = map.copy();
let minutes = 0;
while (true) {
  let progress = false;
  const newOxyMap = oxyMap.copy();

  const xMax = oxyMap.originX + oxyMap.dimension;
  const yMax = oxyMap.originY + oxyMap.dimension;
  for (let x = oxyMap.originX; x < xMax; ++x) {
    for (let y = oxyMap.originY; y < yMax; ++y) {
      if (oxyMap.get(x, y) === OXYGEN) {
        DIRECTIONS.forEach(direction => {
          const newX = x + direction.xOffset;
          const newY = y + direction.yOffset;
          if (oxyMap.get(newX, newY) === EMPTY) {
            newOxyMap.set(newX, newY, OXYGEN);
            progress = true;
          }
        });
      }
    }
  }

  if (!progress) {
    break;
  }
  ++minutes;
  oxyMap = newOxyMap;
  // p("-------------------------------------------------------------------");
  // p(oxyMap.draw());
}

p("minutes: " + minutes)
