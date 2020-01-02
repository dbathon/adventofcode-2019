import { IntCodeComputer } from './util/intCodeComputer';
import { readLines, p } from './util/util';
import { readSync, closeSync, openSync } from 'fs';

const memory = readLines('input/a25.txt')[0].split(",").map(str => parseInt(str));

function readLine() {
  const bytesRead: number[] = [];
  const tempBuffer = Buffer.alloc(1);

  let fd = undefined;
  try {
    fd = openSync('/dev/stdin', 'rs');

    while (bytesRead[bytesRead.length - 1] !== 10) {
      if (readSync(fd, tempBuffer, 0, 1, null) > 0) {
        bytesRead.push(tempBuffer[0]);
      }
    }
  }
  finally {
    if (fd) {
      closeSync(fd);
    }
  }

  return Buffer.from(bytesRead).toString('utf-8');
}

function textToInput(text: string) {
  return text.split("").map(char => char.charCodeAt(0));
}

function outputToText(output: number[]) {
  return output.map(charCode => String.fromCharCode(charCode)).join("");
}

const computer = new IntCodeComputer(memory);

while (true) {
  computer.runUntilInputRequiredOrHalt();
  if (computer.output.length > 0) {
    computer.output.pop();
    p(outputToText(computer.output));
    computer.output.length = 0;
  }

  if (computer.didHalt) {
    break;
  }
  else {
    computer.input.push(...textToInput(readLine()));
  }
}
