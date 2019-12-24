import { p, readLines } from "./util";
import { Map2D, Map2DNode } from "./map2D";
import { dijkstraSearch, Neighbor, Node as DijkstraNode } from "./graphUtil";

const input = readLines('input/a20.txt', false);

const map: Map2D<string> = new Map2D();

type Node = Map2DNode<string>;

input.forEach((row, y) => row.split("").forEach((cell, x) => {
  map.set(x, y, cell);
}));

function isLetter(cell: string) {
  const charCode = cell.charCodeAt(0);
  return "A".charCodeAt(0) <= charCode && "Z".charCodeAt(0) >= charCode;
}

// name -> node
const uniqueEntrances: Map<string, Node> = new Map();

// nodeKey -> other node
const portals: Map<string, Node> = new Map();

map.forEachNode((node) => {
  if (node.value === ".") {
    let name: string;
    if (isLetter(node.getUp().value)) {
      name = node.getUp().getUp().value + node.getUp().value
    }
    else if (isLetter(node.getLeft().value)) {
      name = node.getLeft().getLeft().value + node.getLeft().value
    }
    else if (isLetter(node.getRight().value)) {
      name = node.getRight().value + node.getRight().getRight().value
    }
    else if (isLetter(node.getDown().value)) {
      name = node.getDown().value + node.getDown().getDown().value
    }
    if (name !== undefined) {
      if (uniqueEntrances.has(name)) {
        const other = uniqueEntrances.get(name);
        uniqueEntrances.delete(name);
        portals.set(node.getNodeKey(), other);
        portals.set(other.getNodeKey(), node);
      }
      else {
        uniqueEntrances.set(name, node);
      }
    }
  }
});

let from = uniqueEntrances.get("AA");
let to = uniqueEntrances.get("ZZ");

// nodeKey -> other node
const outsidePortals: Map<string, Node> = new Map();
const insidePortals: Map<string, Node> = new Map();

const INSIDE_OFFSET = 6;

function isInside(nodeKey: string) {
  const [x, y] = nodeKey.split(";").map(str => parseInt(str));
  return x >= INSIDE_OFFSET && x <= map.width - INSIDE_OFFSET
    && y >= INSIDE_OFFSET && y <= map.height - INSIDE_OFFSET;
}

portals.forEach((node, nodeKey) => {
  if (isInside(nodeKey)) {
    insidePortals.set(nodeKey, node);
  }
  else {
    outsidePortals.set(nodeKey, node);
  }
});

p([...insidePortals.keys()]);
p([...outsidePortals.keys()]);

function findShortest(from: Node, to: Node, outSidePortals: Map<string, Node>, insidePortals: Map<string, Node>, portalShift = false): number {
  class SearchNode implements DijkstraNode {
    constructor(readonly node: Node, readonly level: number) { }
    getNodeKey() {
      return this.node.getNodeKey() + ";" + this.level;
    }
  }
  let shortest: number;
  dijkstraSearch((searchNode: SearchNode, _, distance) => {
    const node = searchNode.node;
    const level = searchNode.level;
    if (level === 0 && node.getNodeKey() === to.getNodeKey()) {
      // path found
      shortest = distance;
      return null;
    }
    const neighbors = node.get4Neighbors()
      .filter(node => node.value === ".")
      .map(node => new Neighbor(new SearchNode(node, level), 1));
    const outsidePortalNode = outSidePortals.get(node.getNodeKey());
    if (outsidePortalNode && (level > 0 || !portalShift)) {
      neighbors.push(new Neighbor(new SearchNode(outsidePortalNode, portalShift ? level - 1 : level), 1));
    }
    const insidePortalNode = insidePortals.get(node.getNodeKey());
    if (insidePortalNode) {
      neighbors.push(new Neighbor(new SearchNode(insidePortalNode, portalShift ? level + 1 : level), 1));
    }
    return neighbors;
  }, new SearchNode(from, 0));

  return shortest;
}

p(findShortest(from, to, outsidePortals, insidePortals));

p(findShortest(from, to, outsidePortals, insidePortals, true));
