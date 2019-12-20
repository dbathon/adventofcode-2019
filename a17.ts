import { IntCodeComputer } from './intCodeComputer';
import { readLines, p } from './util';
import { Map2D } from "./map2D";

const memory = readLines('input/a17.txt')[0].split(",").map(str => parseInt(str));

const map: Map2D<string> = new Map2D();

let x = 0, y = 0;

const computer = new IntCodeComputer(memory);

computer.run().forEach(output => {
  if (output === 10) {
    ++y;
    x = 0;
  }
  else {
    map.set(x, y, String.fromCharCode(output));
    ++x;
  }
});

const SCAFFOLD = ["#", "^", "v", "<", ">"];

p(map.draw());

let startX = 0, startY = 0, startDirection = "";
let alignmentSum = 0;
map.forEach((x, y, value) => {
  if (SCAFFOLD.includes(value)) {
    if (SCAFFOLD.includes(map.get(x + 1, y)) && SCAFFOLD.includes(map.get(x - 1, y))
      && SCAFFOLD.includes(map.get(x, y + 1)) && SCAFFOLD.includes(map.get(x, y - 1))) {
      alignmentSum += x * y;
    }
    if (value !== "#") {
      startX = x;
      startY = y;
      startDirection = value;
    }
  }
});

p(alignmentSum);


class Direction {
  constructor(readonly char: string, readonly left: string, readonly right: string,
    readonly xOffset: number, readonly yOffset: number) { }
}

// part 2
const DIRECTIONS: Map<string, Direction> = new Map();
[
  new Direction("^", "<", ">", 0, -1),
  new Direction("v", ">", "<", 0, 1),
  new Direction("<", "v", "^", -1, 0),
  new Direction(">", "^", "v", 1, 0)
].forEach(direction => DIRECTIONS.set(direction.char, direction));

p([startX, startY, startDirection, DIRECTIONS.get(startDirection)]);

const fullPath: any[] = [];
{
  let x = startX;
  let y = startY;
  let direction = DIRECTIONS.get(startDirection);
  while (true) {
    // find turn direction
    const leftDirection = DIRECTIONS.get(direction.left);
    const rightDirection = DIRECTIONS.get(direction.right);
    let dirChar: string;
    if (map.get(x + leftDirection.xOffset, y + leftDirection.yOffset) === "#") {
      dirChar = "L";
      direction = leftDirection;
    }
    else if (map.get(x + rightDirection.xOffset, y + rightDirection.yOffset) === "#") {
      dirChar = "R";
      direction = rightDirection;
    }
    else {
      // done;
      break;
    }

    // walk as far as possible
    let cnt = 0;
    while (map.get(x + direction.xOffset, y + direction.yOffset) === "#") {
      x += direction.xOffset;
      y += direction.yOffset;
      ++cnt;
    }
    fullPath.push(dirChar);
    fullPath.push(cnt);
  }
}

p(fullPath);
p(fullPath.length);

for (let length = fullPath.length; length > 1; length -= 2) {
  p("-------- " + length);
  const seen: Set<string> = new Set();
  for (let start = 0; start <= fullPath.length - length; ++start) {
    let cnt = 1;
    const subPath = fullPath.slice(start, start + length);
    const subPathString = subPath.join(",");
    if (subPathString.length <= 20 && !seen.has(subPathString)) {
      seen.add(subPathString);
      for (let start2 = start + 1; start2 <= fullPath.length - length; ++start2) {
        if (subPathString === fullPath.slice(start2, start2 + length).join(",")) {
          ++cnt;
        }
      }
      if (cnt > 1) {
        p([subPath, cnt,
          fullPath.join(",").replace(new RegExp(subPathString, "g"), "X")]);
      }
    }
  }
}

memory[0] = 2;
// TODO: solved by hand...
const input = "A,B,A,C,B,C,A,B,A,C\n" +
  "R,6,L,10,R,8,R,8\n" +
  "R,12,L,8,L,10\n" +
  "R,12,L,10,R,6,L,10\n" +
  "n\n";

p(new IntCodeComputer(memory, input.split("").map(char => char.charCodeAt(0))).run());

