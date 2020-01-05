import { p, readLines } from "./util/util";
import { Map2D, Map2DNode } from "./util/map2D";
import { dijkstraSearch, Neighbor, Node as DijkstraNode } from "./util/graphUtil";

const input = readLines("input/a18.txt");

const map: Map2D<string> = new Map2D();

input.forEach((row, y) => row.split("").forEach((cell, x) => {
  map.set(x, y, cell);
}));

function isKey(cell: string | undefined) {
  if (cell === undefined) {
    return false;
  }
  const charCode = cell.charCodeAt(0);
  return ("a".charCodeAt(0) <= charCode && "z".charCodeAt(0) >= charCode) || cell === "@";
}

function isDoor(cell: string | undefined) {
  if (cell === undefined) {
    return false;
  }
  const charCode = cell.charCodeAt(0);
  return "A".charCodeAt(0) <= charCode && "Z".charCodeAt(0) >= charCode;
}

type Node = Map2DNode<string>;

class Edge {
  constructor(readonly node: Node, readonly steps: number, readonly requiredKeys: string[]) { }
}

function buildGraph(map: Map2D<string>, startNode: Node): Map<string, Edge[]> {
  function findEdges(startNode: Node): Edge[] {
    const result: Edge[] = [];
    dijkstraSearch((node: Node, requiredKeys: string[], distance) => {
      if (distance > 0 && isKey(node.value)) {
        // found a key
        result.push(new Edge(node, distance, requiredKeys));
        return [];
      }
      return node.get4Neighbors()
        .filter(node => node.value !== "#")
        .map(node => {
          let newRequiredKeys = requiredKeys;
          if (isDoor(node.value)) {
            newRequiredKeys = [...newRequiredKeys, node.value!.toLowerCase()];
          }
          return new Neighbor(node, 1, newRequiredKeys);
        });
    }, startNode, []);

    return result;
  }

  const result: Map<string, Edge[]> = new Map();
  const queue = [startNode];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const edges = findEdges(node);
    result.set(node.value!, edges);
    edges.forEach(edge => {
      if (!result.has(edge.node.value!)) {
        queue.push(edge.node);
      }
    });
  }

  return result;
}

let x = 0, y = 0;
map.forEach((_x, _y, cell) => {
  if (cell === "@") {
    x = _x;
    y = _y;
  }
});
p([x, y]);

const graph = buildGraph(map, map.getNode(x, y));

// graph.forEach((value, key) => p([key, value.map(edge => [edge.node.value, edge.steps, edge.requiredKeys])]));

function getDistance(fromKey: string, toKey: string, graph: Map<string, Edge[]>, hasKey: (key: string) => boolean) {
  let result: number | undefined = undefined;
  dijkstraSearch((key: string, _, distance) => {
    if (key === toKey) {
      result = distance;
      return null;
    }
    return graph.get(key)!
      .filter(edge => edge.requiredKeys.every(key => hasKey(key)))
      .map(edge => {
        return new Neighbor(edge.node.value!, edge.steps, null);
      });
  }, fromKey, null);
  return result;
}

function findShortestPathSteps(graphs: Map<string, Edge[]>[], startKey: string): number | undefined {
  class PathNode implements DijkstraNode {
    private nodeKey: string;
    readonly pathLength: number;
    constructor(pre: PathNode | null, readonly lastKey: string, readonly currentKeys: string[]) {
      // the order does not matter for all keys before the current one
      this.nodeKey = (pre === null ? "" : pre.getNodeKey().split("").sort().join("")) + lastKey;
      this.pathLength = (pre === null ? 0 : pre.pathLength) + 1;
    }
    getNodeKey() {
      return this.nodeKey;
    }
  }

  const allKeysNotUnique: string[] = [];
  graphs.forEach(graph => allKeysNotUnique.push(...graph.keys()));
  const allKeys = [...new Set(allKeysNotUnique)];

  let lastDistance = -1;
  let calls = 0;

  let result: number | undefined = undefined;

  dijkstraSearch((node, _, distance) => {
    ++calls;
    if (lastDistance !== distance) {
      lastDistance = distance;
      // p([distance, calls]);
    }

    if (node.pathLength === allKeys.length) {
      result = distance;
      // p(node.getNodeKey());
      return null;
    }
    const hasKey = (key: string) => {
      return node.getNodeKey().includes(key);
    };
    return allKeys.filter(key => !hasKey(key))
      .map(key => graphs.map((graph, index) => {
        const steps = getDistance(node.currentKeys[index], key, graph, hasKey);
        if (steps !== undefined) {
          const newCurrentKeys = [...node.currentKeys];
          newCurrentKeys[index] = key;
          return [new Neighbor(new PathNode(node, key, newCurrentKeys), steps, null)];
        }
        return [];
      }))
      .flat(2);
  }, new PathNode(null, startKey, graphs.map(_ => startKey)), null);

  return result;
}

p(findShortestPathSteps([graph], "@"));

// part 2

const oldStart = map.getNode(x, y);
oldStart.value = "#";
oldStart.get4Neighbors().forEach(node => node.value = "#");

const newStarts = [
  oldStart.getUp().getLeft(),
  oldStart.getUp().getRight(),
  oldStart.getDown().getLeft(),
  oldStart.getDown().getRight()
];

newStarts.forEach((node, index) => node.value = "@");

const newGraphs = newStarts.map(node => buildGraph(map, node));

// newGraphs.forEach(graph => {
//   p("--------");
//   graph.forEach((value, key) => p([key, value.map(edge => [edge.node.value, edge.steps, edge.requiredKeys])]));
// });

p(findShortestPathSteps(newGraphs, "@"));
