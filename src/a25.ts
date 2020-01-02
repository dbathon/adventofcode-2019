import { IntCodeComputer } from './util/intCodeComputer';
import { readLines, p } from './util/util';

const memory = readLines('input/a25.txt')[0].split(",").map(str => parseInt(str));

function textToInput(text: string) {
  return text.split("").map(char => char.charCodeAt(0));
}

function outputToText(output: number[]) {
  return output.map(charCode => String.fromCharCode(charCode)).join("");
}

const collectCommands = [
  "east",
  "east",
  "take semiconductor",
  "north",
  "take planetoid",
  "west",
  "take food ration",
  "west",
  "west",
  "take monolith",
  "east",
  "east",
  "north",
  "take space law space brochure",
  "north",
  "north",
  "take weather machine",
  "south",
  "south",
  "east",
  "take jam",
  "west",
  "south",
  "east",
  "north",
  "take antenna",
  "south",
  "south",
  "east",
  "south",
  "south",
  "east",
  "east",
  "inv",
];

const computer = new IntCodeComputer(memory, textToInput(collectCommands.join("\n") + "\n"));

computer.runUntilInputRequiredOrHalt();

p(outputToText(computer.output));

const items: (string | undefined)[] = collectCommands
  .filter(c => c.startsWith("take ")).map(c => c.substr(5));
p(items);

function search(): boolean {
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    if (item) {
      items[i] = undefined;
      // p(items);
      computer.input.push(...textToInput("drop " + item + "\neast\ninv\n"));
      computer.output.length = 0;
      computer.runUntilInputRequiredOrHalt();
      const output = outputToText(computer.output);
      if (output.includes(" are lighter ")) {
        if (search()) {
          return true;
        }
      }
      else if (output.includes(" are heavier ")) {
        // do not continue searching
      }
      else {
        p(output);
        return true;
      }
      computer.input.push(...textToInput("take " + item + "\n"));
      items[i] = item;
    }
  }
  return false;
}

p(search());
