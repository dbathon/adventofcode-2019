import { IntCodeComputer } from './intCodeComputer';
import { readLines, p } from './util';

const memory = readLines('input/a21.txt')[0].split(",").map(str => parseInt(str));


function textToInput(text: string) {
  return text.split("").map(char => char.charCodeAt(0));
}

function outputToText(output: number[]) {
  return output.map(charCode => String.fromCharCode(charCode)).join("");
}

function run(program: string) {
  const computer = new IntCodeComputer(memory, textToInput(program));
  computer.run();
  if (computer.lastOutput > 255) {
    p(computer.lastOutput);
  }
  else {
    p(outputToText(computer.output));
  }
}

{
  // J = (!B AND D) OR (!C AND B AND D) OR !A

  const program = [
    "NOT B J",
    "AND D J",

    "NOT C T",
    "AND B T",
    "AND D T",
    "OR T J",

    "NOT A T",
    "OR T J",
  ].join("\n") + "\nWALK\n";

  run(program);
}

// part 2
{
  // J = (!B AND D) OR (!C AND B AND D AND H) OR !A

  const program = [
    "NOT B J",
    "AND D J",

    "NOT C T",
    "AND B T",
    "AND D T",
    "AND H T",
    "OR T J",

    "NOT A T",
    "OR T J",
  ].join("\n") + "\nRUN\n";

  run(program);
}
