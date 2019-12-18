import { readFileSync } from 'fs';

export function readLines(path: string) {
  const input = readFileSync(path).toString();
  return input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

export function sum(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0);
}

export function p(input: any) {
  console.log(typeof input === "string" ? input : JSON.stringify(input));
}

export function splitArray<T>(array: T[], splitLength: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += splitLength) {
    result.push(array.slice(i, i + splitLength));
  }
  return result;
}

export function findMax<T>(list: T[], toNumber: (t: T) => number): { max: number, maxElement: T } {
  let max = undefined;
  let maxElement = undefined;
  list.forEach(element => {
    const value = toNumber(element);
    if (typeof max === "undefined" || value > max) {
      max = value;
      maxElement = element;
    }
  });
  return { max, maxElement };
}

/**
 * A 2D map of T elements around (0,0). It grows as needed in all directions (but is not sparse).
 */
export class Map2D<T> {
  private data: T[] = [];
  dimension = 10;
  originX = 0;
  originY = 0;

  copy(): Map2D<T> {
    const result: Map2D<T> = new Map2D();
    result.data = this.data.slice(0);
    result.dimension = this.dimension;
    result.originX = this.originX;
    result.originY = this.originY;
    return result;
  }

  private getIndex(x: number, y: number, grow = false): number {
    const xIndex = x - this.originX;
    const yIndex = y - this.originY;
    if (xIndex < 0 || xIndex >= this.dimension || yIndex < 0 || yIndex >= this.dimension) {
      if (!grow) {
        return undefined;
      }
      // we need to grow
      const oldMap: Map2D<T> = this.copy();

      this.data.length = 0;
      if (xIndex < 0) {
        this.originX = x;
      }
      if (yIndex < 0) {
        this.originY = y;
      }
      if (xIndex >= this.dimension || yIndex >= this.dimension) {
        this.dimension = Math.max(xIndex, yIndex) + 1;
      }

      // now just copy the data from oldMap
      oldMap.forEach((x, y, value) => {
        this.set(x, y, value);
      })

      return this.getIndex(x, y);
    }
    return (yIndex * this.dimension) + xIndex;
  }

  get(x: number, y: number): T {
    const index = this.getIndex(x, y);
    return index === undefined ? undefined : this.data[index];
  }

  set(x: number, y: number, value: T): void {
    if (value !== undefined) {
      this.data[this.getIndex(x, y, true)] = value;
    }
  }

  forEach(callback: (x: number, y: number, value: T) => any) {
    const dimension = this.dimension;
    const originX = this.originX;
    const originY = this.originY;
    for (let y = 0; y < dimension; ++y) {
      for (let x = 0; x < dimension; ++x) {
        const realX = originX + x;
        const realY = originY + y;
        callback(realX, realY, this.get(realX, realY));
      }
    }
  }

  getAsArray(): T[][] {
    const result: T[][] = [];
    for (let y = 0; y < this.dimension; ++y) {
      const row: T[] = [];
      result.push(row);
      for (let x = 0; x < this.dimension; ++x) {
        row[x] = this.get(this.originX + x, this.originY + y);
      }
    }
    return result;
  }

  /**
   * This only works if all the elements are single character strings.
   */
  draw(): string {
    return this.getAsArray().map(row => row.map(element => {
      return element === undefined ? " " : element;
    }).join("")).join("\n");
  }
}
