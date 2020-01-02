import { readLines, p } from "./util";

const lines = readLines('input/a03.txt');
const line1 = lines[0].split(",");
const line2 = lines[1].split(",");


function positions(path: string[]) {
  let x = 0, y = 0, steps = 0;
  const result: Map<string, number> = new Map();
  path.forEach(el => {
    const dir = el[0];
    const dist = parseInt(el.substr(1));
    for (let i = 0; i < dist; ++i) {
      if ("R" === dir) {
        ++x;
      }
      else if ("L" === dir) {
        --x;
      }
      else if ("U" === dir) {
        ++y;
      }
      else if ("D" === dir) {
        --y;
      }
      else {
        throw "unexpected " + dir;
      }
      ++steps
      const pos = x + "x" + y;
      if (!result.has(pos)) {
        result.set(pos, steps);
      }
    }
  });
  return result;
}

const p1 = positions(line1);
const p2 = positions(line2);

p1.forEach((dist, pos) => {
  if (p2.has(pos)) {
    let [x, y] = pos.split("x");
    p(Math.abs(parseInt(x)) + Math.abs(parseInt(y)));
  }
});

p("--------------");

p1.forEach((dist, pos) => {
  if (p2.has(pos)) {
    p(dist + p2.get(pos)!);
  }
});
