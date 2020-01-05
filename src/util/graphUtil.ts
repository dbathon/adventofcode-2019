import { Heap } from "./util";

export interface Node {
  getNodeKey(): any;
}

export class Neighbor<N extends Node | string, State> {
  constructor(readonly node: N, readonly distance: number, readonly state: State) { }
}

export function dijkstraSearch<N extends Node | string, State>(
  getNeighbors: (node: N, state: State, distance: number) => Neighbor<N, State>[] | null,
  start: N,
  initialState: State
): void {
  class QueueEntry {
    constructor(readonly node: N, readonly state: State, readonly distance: number) { }
  }

  function getNodeKey<N extends Node | string>(node: N) {
    return typeof node === "string" ? node : (node as Node).getNodeKey();
  }

  const queue = new Heap<QueueEntry>((a, b) => a.distance < b.distance);
  queue.insert(new QueueEntry(start, initialState, 0));

  const seen: Set<any> = new Set();

  while (queue.size > 0) {
    const entry = queue.remove();

    const node = entry.node;
    const nodeKey = getNodeKey(node);
    if (!seen.has(nodeKey)) {
      seen.add(nodeKey);

      const neighbors = getNeighbors(node, entry.state, entry.distance);
      if (neighbors === null) {
        return;
      }

      neighbors.forEach(info => {
        if (!seen.has(getNodeKey(info.node))) {
          queue.insert(new QueueEntry(info.node, info.state, entry.distance + info.distance));
        }
      });
    }
  }
}
