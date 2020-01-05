import { IntCodeComputer } from "./util/intCodeComputer";
import { p, readLines } from "./util/util";

const memory = readLines("input/a07.txt")[0].split(",").map(str => parseInt(str));


function runAmps(sequence: number[], withFeedback = false) {
  const amps = sequence.map(phaseSetting => {
    const comp = new IntCodeComputer(memory);
    comp.input = [phaseSetting];
    return comp;
  });

  amps[0].input.push(0);
  while (true) {
    for (let i = 0; i < amps.length; ++i) {
      amps[i].runUntilOutputOrHalt();
      amps[(i + 1) % amps.length].input.push(amps[i].lastOutput);
    }

    if (!withFeedback || amps.every(amp => amp.didHalt)) {
      break;
    }
  }
  return amps[amps.length - 1].lastOutput;
}

const settings = [0, 1, 2, 3, 4];

function findBest(settings: number[], withFeedback: boolean) {
  let max = -1;
  let maxSequece = null;

  settings.forEach(i1 => {
    const rest1 = settings.filter(i => i !== i1);
    rest1.forEach(i2 => {
      const rest2 = rest1.filter(i => i !== i2);
      rest2.forEach(i3 => {
        const rest3 = rest2.filter(i => i !== i3);
        rest3.forEach(i4 => {
          const rest4 = rest3.filter(i => i !== i4);
          rest4.forEach(i5 => {
            const sequence = [i1, i2, i3, i4, i5];
            const out = runAmps(sequence, withFeedback);
            if (out > max) {
              max = out;
              maxSequece = sequence;
            }
          });
        });
      });
    });
  });
  return { max, maxSequece };
}

p(findBest([0, 1, 2, 3, 4], false));
p(findBest([5, 6, 7, 8, 9], true));
