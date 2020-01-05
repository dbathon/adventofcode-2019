import { readFileSync } from "fs";

export function readLines(path: string, trim = true) {
  const input = readFileSync(path).toString();
  return input.split("\n").map(line => trim ? line.trim() : line).filter(line => line.length > 0);
}

export function sum(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0);
}

export function p(input: any) {
  console.log(typeof input === "string"
    ? input
    : JSON.stringify(input, (key, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value));
}

export function splitArray<T>(array: T[], splitLength: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += splitLength) {
    result.push(array.slice(i, i + splitLength));
  }
  return result;
}

export function findMax<T>(list: T[], toNumber: (t: T) => number): { max: number | undefined; maxElement: T | undefined; } {
  let max: number | undefined = undefined;
  let maxElement: T | undefined = undefined;
  list.forEach(element => {
    const value = toNumber(element);
    if (typeof max === "undefined" || value > max) {
      max = value;
      maxElement = element;
    }
  });
  return { max, maxElement };
}

export class Heap<T> {
  private data: T[] = [];
  constructor(readonly isABeforeB: (a: T, b: T) => boolean) { }

  private child1Index(index: number) {
    return 2 * index + 1;
  }
  private child2Index(index: number) {
    return 2 * index + 2;
  }
  private parentIndex(index: number) {
    if (index <= 0) {
      throw "no parent";
    }
    return Math.ceil(index / 2) - 1;
  }

  private swap(index1: number, index2: number) {
    const tmp = this.data[index1];
    this.data[index1] = this.data[index2];
    this.data[index2] = tmp;
  }

  get size() {
    return this.data.length;
  }

  insert(element: T) {
    let index = this.data.length;
    this.data[index] = element;
    while (index > 0) {
      const parent = this.parentIndex(index);
      if (this.isABeforeB(this.data[parent], this.data[index])) {
        // done
        return;
      }
      else {
        this.swap(index, parent);
      }

      index = parent;
    }
  }

  remove(): T {
    if (this.size === 0) {
      throw "empty";
    }
    const result = this.data[0];

    if (this.size === 1) {
      this.data.pop();
    }
    else {
      let index = 0;
      this.data[index] = this.data.pop()!;
      const newSize = this.size;
      while (index < newSize) {
        const child1 = this.child1Index(index);
        if (child1 >= newSize) {
          break;
        }
        const child2 = this.child2Index(index);
        let child: number;
        if (child2 >= newSize) {
          child = child1;
        }
        else {
          child = this.isABeforeB(this.data[child1], this.data[child2]) ? child1 : child2;
        }
        if (this.isABeforeB(this.data[index], this.data[child])) {
          break;
        }
        this.swap(index, child);
        index = child;
      }
    }
    return result;
  }
}
