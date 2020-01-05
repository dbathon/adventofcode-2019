import { IntCodeComputer } from "./util/intCodeComputer";
import { readLines, p } from "./util/util";

const memory = readLines("input/a02.txt")[0].split(",").map(str => parseInt(str));

p(memory);

function run(noun: number, verb: number) {
  const computer = new IntCodeComputer(memory);

  computer.write(1, noun);
  computer.write(2, verb);

  computer.run();

  return computer.read(0);
}

p(run(12, 2));


for (let i = 0; i < 100; ++i) {
  for (let j = 0; j < 100; ++j) {
    if (run(i, j) === 19690720) {
      p(i * 100 + j);
    }
  }
}
