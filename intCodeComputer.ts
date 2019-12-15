
interface Param {
  read(): number;
  write(value: number): void;
}

class ImmediateParam implements Param {
  constructor(readonly value: number) { }

  read(): number {
    return this.value;
  }

  write(value: number): void {
    throw "write not supported for immediate mode parameters";
  }
}

class AddressParam implements Param {
  constructor(readonly computer: IntCodeComputer, readonly address: number) { }

  read(): number {
    return this.computer.read(this.address);
  }

  write(value: number): void {
    this.computer.write(this.address, value);
  }
}

class Op {
  constructor(readonly opcode: number, readonly paramCount: number, readonly op: (computer: IntCodeComputer, params: Param[]) => boolean | number) { }
}

const OPS = [
  // add
  new Op(1, 3, (computer, params) => {
    params[2].write(params[0].read() + params[1].read());
    return true;
  }),
  // multiply
  new Op(2, 3, (computer, params) => {
    params[2].write(params[0].read() * params[1].read());
    return true;
  }),
  // input
  new Op(3, 1, (computer, params) => {
    const value = computer.readInput(computer);
    if (typeof value !== "number") {
      throw "no input available";
    }
    params[0].write(value);
    return true;
  }),
  // output
  new Op(4, 1, (computer, params) => {
    computer.writeOutput(params[0].read(), computer);
    return true;
  }),
  // jump-if-true
  new Op(5, 2, (computer, params) => {
    return params[0].read() !== 0 ? params[1].read() : true;
  }),
  // jump-if-false
  new Op(6, 2, (computer, params) => {
    return params[0].read() === 0 ? params[1].read() : true;
  }),
  // less than
  new Op(7, 3, (computer, params) => {
    params[2].write(params[0].read() < params[1].read() ? 1 : 0);
    return true;
  }),
  // equals
  new Op(8, 3, (computer, params) => {
    params[2].write(params[0].read() === params[1].read() ? 1 : 0);
    return true;
  }),
  // set relativeBase
  new Op(9, 1, (computer, params) => {
    computer.relativeBase += params[0].read();
    return true;
  }),
  // halt
  new Op(99, 0, (computer, params) => {
    return false;
  }),
];

const OPS_BY_OPCODE: Map<number, Op> = new Map();
OPS.forEach(op => OPS_BY_OPCODE.set(op.opcode, op));

export class IntCodeComputer {
  pc: number = 0;
  relativeBase: number = 0;
  memory: number[];
  input: number[];
  output: number[] = [];

  readInput: (computer: IntCodeComputer) => number = (computer) => computer.input.shift();
  writeOutput: (value: number, computer: IntCodeComputer) => void = (value, computer) => computer.output.push(value);

  constructor(memory: number[], input: number[] = []) {
    this.memory = memory.slice(0);
    this.input = input.slice(0);
  }

  /**
   * @returns a copy of this IntCodeComputer with all the state, both instances can be used indepedently.
   */
  copy(): IntCodeComputer {
    const result = new IntCodeComputer(this.memory, this.input);
    result.pc = this.pc;
    result.relativeBase = this.relativeBase;
    result.output = this.output.slice(0);
    result.readInput = this.readInput;
    result.writeOutput = this.writeOutput;
    return result;
  }

  private checkAddress(address: number) {
    if (address < 0) {
      throw "invalid address: " + address;
    }
  }

  read(address: number) {
    this.checkAddress(address);
    const result = this.memory[address];
    return result === undefined ? 0 : result;
  }

  write(address: number, value: number) {
    this.checkAddress(address);
    this.memory[address] = value;
  }

  step(): boolean {
    const opcode = this.read(this.pc);
    const op = OPS_BY_OPCODE.get(opcode % 100);
    if (!op) {
      throw "invalid opcode " + opcode + " at " + this.pc;
    }

    const params: Param[] = [];

    let decodeInfo = Math.floor(opcode / 100);
    for (let i = 0; i < op.paramCount; ++i) {
      const paramValue = this.read(this.pc + i + 1);
      const paramMode = decodeInfo % 10;
      if (paramMode === 1) {
        params.push(new ImmediateParam(paramValue));
      }
      else if (paramMode === 0 || paramMode === 2) {
        const address = paramValue + (paramMode === 2 ? this.relativeBase : 0);
        params.push(new AddressParam(this, address));
      }
      else {
        throw "invalid decode info in opcode " + opcode + " at " + this.pc + ", i = " + i;
      }

      decodeInfo = Math.floor(decodeInfo / 10);
    }

    const result = op.op(this, params);
    if (result === true) {
      this.pc += op.paramCount + 1;
    }
    else if (typeof result === "number") {
      this.pc = result;
    }

    return result !== false;
  }

  run() {
    while (this.step()) { }
    return this.output;
  }

  runUntilOutputOrHalt() {
    while (true) {
      const opcode = this.read(this.pc);
      if (!this.step()) {
        break;
      }
      if (opcode % 100 === 4) {
        // the last opcode was output
        break;
      }
    }
  }

  get didHalt() {
    return this.read(this.pc) % 100 === 99;
  }

  get lastOutput() {
    return this.output[this.output.length - 1];
  }
}
