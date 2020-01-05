import { IntCodeComputer } from "./util/intCodeComputer";
import { readLines, p } from "./util/util";

const memory = readLines("input/a23.txt")[0].split(",").map(str => parseInt(str));

function run(withNatHandling = false) {
  const computers: IntCodeComputer[] = [];

  const lastOp: string[] = [];
  const seenNat: Set<number> = new Set();

  for (let i = 0; i < 50; ++i) {
    const computer = new IntCodeComputer(memory, [i]);
    computer.readInput = (c) => {
      if (c.input.length > 0) {
        lastOp[i] = "in";
        return c.input.shift();
      }
      else {
        lastOp[i] = "no in";
        return -1;
      }
    };
    computers.push(computer);
  }

  let lastNatX: number | undefined = undefined,
    lastNatY: number | undefined = undefined;

  outer: while (true) {
    for (let i = 0; i < 50; ++i) {
      const computer = computers[i];
      const outLengthBefore = computer.output.length;
      computer.step();
      const outLengthAfter = computer.output.length;
      if (outLengthAfter > outLengthBefore) {
        lastOp[i] = "out";
      }
      if (outLengthAfter === 3) {
        const address = computer.output.shift()!;
        const x = computer.output.shift()!;
        const y = computer.output.shift()!;
        if (address >= 0 && address < 50) {
          computers[address].input.push(x);
          computers[address].input.push(y);
        }
        else if (address === 255) {
          if (withNatHandling) {
            lastNatX = x;
            lastNatY = y;
          } else {
            p(y);
            break outer;
          }
        }
        else {
          p([address, x, y]);
        }
      }
    }

    if (withNatHandling && lastNatX !== undefined && lastNatY !== undefined
      && computers.every((_, i) => lastOp[i] === "no in")) {
      computers[0].input.push(lastNatX);
      computers[0].input.push(lastNatY);
      // reset lastOp
      lastOp.length = 0;
      // p(["nat y", lastNatY]);
      if (seenNat.has(lastNatY)) {
        p(lastNatY);
        break outer;
      }
      seenNat.add(lastNatY);
    }
  }
}

run(false);

run(true);
