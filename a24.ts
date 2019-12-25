import { p, readLines } from "./util";
import { Map2D, Map2DNode } from "./map2D";

const input = readLines('input/a24.txt');

const map: Map2D<string> = new Map2D();

input.forEach((row, y) => row.split("").forEach((cell, x) => {
  map.set(x, y, cell);
}));

function nextIteration(map: Map2D<string>): Map2D<string> {
  const result: Map2D<string> = new Map2D();
  map.forEachNode(node => {
    let current = node.value;
    const adjacentBugs = node.get4Neighbors().filter(neighbor => neighbor.value === "#").length;
    if (current === "#" && adjacentBugs !== 1) {
      current = ".";
    }
    else if (current === "." && (adjacentBugs === 1 || adjacentBugs === 2)) {
      current = "#";
    }
    result.set(node.x, node.y, current);
  })

  return result;
}

function bioDiversity(map: Map2D<string>): number {
  let result = 0;
  map.forEachNode(node => {
    if (node.value === "#") {
      result += 2 ** (node.y * map.width + node.x);
    }
  });
  return result;
}

const seen: Set<string> = new Set();

let current = map.copy();
while (true) {
  const key = current.draw();
  if (seen.has(key)) {
    p(bioDiversity(current));
    break;
  }
  seen.add(key);
  current = nextIteration(current);
}

// part 2

function nextIterationRecursive(levels: Map2D<Map2D<string>>): Map2D<Map2D<string>> {
  const result: Map2D<Map2D<string>> = new Map2D();
  result.set(0, levels.originY - 1, new Map2D<string>());
  result.set(0, levels.originY + levels.height, new Map2D<string>());
  levels.forEach((x, y) => result.set(x, y, new Map2D<string>()));

  result.forEachNode(resultLevelNode => {
    const resultMap = resultLevelNode.value;
    const levelNode = levels.getNode(resultLevelNode.x, resultLevelNode.y);
    let map = levelNode.value;
    if (map === undefined) {
      // dummy map
      map = new Map2D();
      map.set(0, 0, ".");
      map.set(4, 4, ".");
    }
    const downMap = levelNode.getDown().value;
    const upMap = levelNode.getUp().value;
    map.forEachNode(node => {
      if (node.x !== 2 || node.y !== 2) {
        let neighbors: Map2DNode<string>[] = [];
        node.get4Neighbors().forEach(neighbor => {
          if (neighbor.x < 0 || neighbor.x >= 5 || neighbor.y < 0 || neighbor.y >= 5) {
            if (upMap !== undefined) {
              if (neighbor.x < 0) {
                neighbors.push(upMap.getNode(1, 2));
              }
              if (neighbor.x >= 5) {
                neighbors.push(upMap.getNode(3, 2));
              }
              if (neighbor.y < 0) {
                neighbors.push(upMap.getNode(2, 1));
              }
              if (neighbor.y >= 5) {
                neighbors.push(upMap.getNode(2, 3));
              }
            }
          }
          else if (neighbor.x === 2 && neighbor.y === 2) {
            if (downMap !== undefined) {
              for (let i = 0; i < 5; ++i) {
                if (node.x === 1) {
                  neighbors.push(downMap.getNode(0, i));
                }
                if (node.x === 3) {
                  neighbors.push(downMap.getNode(4, i));
                }
                if (node.y === 1) {
                  neighbors.push(downMap.getNode(i, 0));
                }
                if (node.y === 3) {
                  neighbors.push(downMap.getNode(i, 4));
                }
              }
            }
          }
          else {
            // simple case
            neighbors.push(neighbor);
          }
        })
        const adjacentBugs = neighbors.filter(neighbor => neighbor.value === "#").length;
        // p([levelNode.y, node.x, node.y, neighbors.length, adjacentBugs]);
        let current = node.value || ".";
        if (current === "#" && adjacentBugs !== 1) {
          current = ".";
        }
        else if (current === "." && (adjacentBugs === 1 || adjacentBugs === 2)) {
          current = "#";
        }
        resultMap.set(node.x, node.y, current);
      }
    })
  })

  return result;
}

function printLevels(levels: Map2D<Map2D<string>>) {
  levels.forEach((_, y, map) => {
    p("----------- " + y);
    p(map.draw());
  });
}

let levels: Map2D<Map2D<string>> = new Map2D();
levels.set(0, 0, map.copy());

for (let i = 0; i < 200; ++i) {
  levels = nextIterationRecursive(levels);
}

let count = 0;
levels.forEachNode(node => {
  node.value.forEachNode(node2 => {
    if (node2.value === "#") {
      ++count;
    }
  })
});
p(count);
