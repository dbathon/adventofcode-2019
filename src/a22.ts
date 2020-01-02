import { p, readLines } from "./util/util";

const input = readLines('input/a22.txt');

function gcdExtended(a: bigint, b: bigint): { g: bigint, x: bigint, y: bigint } {
  if (a === 0n) {
    return { g: b, x: 0n, y: 1n };
  }

  const { g, x, y } = gcdExtended(b % a, a);

  return { g, x: y - b / a * x, y: x };
}

function modInverse(a: bigint, m: bigint) {
  const { g, x } = gcdExtended(a, m);

  if (g !== 1n)
    throw "g = " + g;

  return (x + m) % m;
}

function operations(input: string[], n: bigint, inverse = false): ((card: bigint) => bigint)[] {
  return input.map(line => {
    const parts = line.split(" ");
    if (parts[0] === "cut") {
      const pos = BigInt(parts[1]) * (inverse ? -1n : 1n);
      const realPos = pos < 0 ? n + pos : pos;
      return (card: bigint) => (card + n - realPos) % n;
    }
    if (parts[1] === "into") {
      return (card: bigint) => (n - 1n + ((n - 1n) * card)) % n;
    }
    if (parts[1] === "with") {
      let increment = BigInt(parts[3]);
      if (inverse) {
        increment = modInverse(increment, n);
      }
      return (card: bigint) => (card * increment) % n;
    }
    throw "unexpected line: " + line;
  });
}

class ModOperation {
  multiplier = 1n;
  extra = 0n;
  constructor(readonly m: bigint) { }

  private makePositive(a: bigint) {
    while (a < 0) {
      a += this.m;
    }
    return a;
  }

  copy() {
    const result = new ModOperation(this.m);
    result.multiplier = this.multiplier;
    result.extra = this.extra;
    return result;
  }

  plus(a: bigint) {
    this.extra = (this.extra + this.makePositive(a)) % this.m;
  }

  multiply(a: bigint) {
    const positiveA = this.makePositive(a);
    this.multiplier = (this.multiplier * positiveA) % this.m;
    this.extra = (this.extra * positiveA) % this.m;
  }

  eval(a: bigint): bigint {
    return (this.multiplier * this.makePositive(a) + this.extra) % this.m;
  }

  evalOp(modOperation: ModOperation): ModOperation {
    const result = this.copy();
    result.multiply(modOperation.multiplier);
    result.plus(modOperation.extra);
    return result;
  }
}

function operationsAsModOperation(input: string[], n: bigint, inverse = false): ModOperation {
  const modOperation = new ModOperation(n);
  (inverse ? [...input].reverse() : input).forEach(line => {
    const parts = line.split(" ");
    if (parts[0] === "cut") {
      const pos = BigInt(parts[1]) * (inverse ? -1n : 1n);
      const realPos = pos < 0 ? n + pos : pos;
      modOperation.plus(n - realPos);
    }
    else if (parts[1] === "into") {
      modOperation.multiply(-1n);
      modOperation.plus(-1n);
    }
    else if (parts[1] === "with") {
      let increment = BigInt(parts[3]);
      if (inverse) {
        increment = modInverse(increment, n);
      }
      modOperation.multiply(increment);
    }
    else {
      throw "unexpected line: " + line;
    }
  });

  return modOperation;
}

{
  const N = 10007n;
  let card = 2019n;

  operations(input, N).forEach(operation => {
    card = operation(card);
    if (card < 0 || card >= N) {
      throw "illeagl card: " + card + ", " + operation;
    }
  })

  p(card);

  operations(input, N, true).reverse().forEach(operation => {
    card = operation(card);
    if (card < 0 || card >= N) {
      throw "illeagl card: " + card + ", " + operation;
    }
  })

  p(card);
}

{
  const N = 10007n;
  let card = 2019n;

  card = operationsAsModOperation(input, N).eval(card);

  p(card);

  card = operationsAsModOperation(input, N, true).eval(card);

  p(card);
}

{
  function evalTimes(op: ModOperation, times: bigint): ModOperation {
    if (times <= 0n) {
      return new ModOperation(op.m);
    }
    let result = op;
    let cur = 1n;
    while (true) {
      if (cur * 2n > times) {
        break;
      }
      cur *= 2n;
      result = result.evalOp(result);
    }
    return result.evalOp(evalTimes(op, times - cur));
  }

  const N = 119315717514047n;
  const endPos = 2020n;

  const inverseOperation = operationsAsModOperation(input, N, true);

  p(evalTimes(inverseOperation, 101741582076661n).eval(endPos));
}
