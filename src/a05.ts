import { IntCodeComputer } from './util/intCodeComputer';
import { readLines, p } from './util/util';

const memory = readLines('input/a05.txt')[0].split(",").map(str => parseInt(str));


{
  const computer = new IntCodeComputer(memory);
  computer.input = [1];
  computer.run();
  p(computer.output);
}

{
  const programs = [
    [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8],
    [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8],
    [3, 3, 1108, -1, 8, 3, 4, 3, 99],
    [3, 3, 1107, -1, 8, 3, 4, 3, 99],
    [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
      1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
      999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99]];

  [7, 8, 9].forEach(input => {
    p("--------- " + input);
    programs.forEach(program => {
      const computer = new IntCodeComputer(program);
      computer.input = [input];
      computer.run();
      p(computer.output);
    });
  });
}


{
  const computer = new IntCodeComputer(memory);
  computer.input = [5];
  computer.run();
  p(computer.output);
}
