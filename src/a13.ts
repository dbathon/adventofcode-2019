import { IntCodeComputer } from './util/intCodeComputer';
import { readLines, p, splitArray, sum } from './util/util';

const memory = readLines('input/a13.txt')[0].split(",").map(str => parseInt(str));

const output = new IntCodeComputer(memory).run();

let screen: number[][] = [];

function printScreen() {
  screen.forEach(line => p(line.join("").replace(/0/g, " ")));
}

function draw(x: number, y: number, tile: number) {
  const line: number[] = screen[y] || []
  line[x] = tile;
  screen[y] = line;
}

splitArray(output, 3).forEach(([x, y, tile]) => {
  draw(x, y, tile);
});

printScreen();
p(sum(screen.map(line => line.filter(tile => tile === 2).length)));

// part2
screen = [];
memory[0] = 2;

let ballX = -1;
let paddleX = -1;
let score = -1;

const comp = new IntCodeComputer(memory);
comp.readInput = () => {
  // printScreen();
  const direction = paddleX === ballX ? 0 : (ballX - paddleX) / Math.abs(ballX - paddleX);
  // p([paddleX, ballX, direction]);
  return direction;
};
let outBuffer: number[] = [];
comp.writeOutput = (value) => {
  outBuffer.push(value);
  if (outBuffer.length == 3) {
    const [x, y, tile] = outBuffer;
    outBuffer = [];
    if (x === -1) {
      // p("----------------- score: " + tile);
      score = tile;
    }
    else {
      draw(x, y, tile);
      if (tile === 3) {
        paddleX = x;
      }
      if (tile === 4) {
        ballX = x;
      }
    }
  }
}
comp.run();

p(score);
