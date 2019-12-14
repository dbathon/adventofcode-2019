
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
    params[0].write(computer.input.shift());
    return true;
  }),
  // output
  new Op(4, 1, (computer, params) => {
    computer.output.push(params[0].read());
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

  constructor(memory: number[], input: number[] = []) {
    this.memory = memory.slice(0);
    this.input = input.slice(0);
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
      const cntBefore = this.output.length;
      if (!this.step()) {
        break;
      }
      if (this.output.length > cntBefore) {
        break;
      }
    }
  }

  get didHalt() {
    return this.read(this.pc) % 100 === 99;
  }

  get lastOutput() {
    return this.output.length > 0 ? this.output[this.output.length - 1] : null;
  }
}
