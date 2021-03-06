import { IntCodeComputer } from "./util/intCodeComputer";
import { readLines, p } from "./util/util";

const memory = readLines("input/a09.txt")[0].split(",").map(str => parseInt(str));

{
  const programs = [
    [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99],
    [1102, 34915192, 34915192, 7, 4, 7, 99, 0],
    [104, 1125899906842624, 99]];

  programs.forEach(program => {
    p(new IntCodeComputer(program).run());
  });
}

[1, 2].forEach(input => {
  p(new IntCodeComputer(memory, [input]).run());
});
