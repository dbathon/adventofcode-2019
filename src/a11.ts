import { IntCodeComputer } from './util/intCodeComputer';
import { readLines, p } from './util/util';
import { Map2D } from "./util/map2D";

const memory = readLines('input/a11.txt')[0].split(",").map(str => parseInt(str));

const BLACK = ".";
const WHITE = "#";

class Direction {
  constructor(readonly xOffset: number, readonly yOffset: number) { }
}

const DIRECTIONS = [
  new Direction(0, -1),
  new Direction(1, 0),
  new Direction(0, 1),
  new Direction(-1, 0)
];

class Robot {
  currentDirection = 0;
  x = 0;
  y = 0;
  computer = new IntCodeComputer(memory);

  move() {
    const direction = DIRECTIONS[this.currentDirection];
    this.x += direction.xOffset;
    this.y += direction.yOffset;
  }

  turnRight() {
    this.currentDirection = (this.currentDirection + 1) % 4;
  }
  turnLeft() {
    this.currentDirection = (this.currentDirection + 3) % 4;
  }
}

function run(startPanel = BLACK) {
  const map: Map2D<string> = new Map2D();

  let paintOnceCount = 0;
  const robot = new Robot();
  map.set(robot.x, robot.y, startPanel);

  while (!robot.computer.didHalt) {
    const oldColor = map.get(robot.x, robot.y);
    robot.computer.input.push(oldColor === WHITE ? 1 : 0);

    robot.computer.runUntilOutputOrHalt();
    map.set(robot.x, robot.y, robot.computer.lastOutput === 1 ? WHITE : BLACK);
    if (oldColor === undefined) {
      ++paintOnceCount;
    }

    robot.computer.runUntilOutputOrHalt();
    if (robot.computer.lastOutput === 1) {
      robot.turnRight();
    }
    else {
      robot.turnLeft();
    }
    robot.move();
  }

  p(map.draw());
  p(paintOnceCount);
}

run();
run(WHITE);
