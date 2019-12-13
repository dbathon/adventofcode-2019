import { p } from "./util";

class Op {
  constructor(public opcode: number, public paramDecode: boolean[], public op: (computer: IntCodeComputer, params: number[]) => boolean | number) { }
}

const OPS = [
  // add
  new Op(1, [true, true, false], (computer, params) => {
    computer.write(params[2], params[0] + params[1]);
    return true;
  }),
  // multiply
  new Op(2, [true, true, false], (computer, params) => {
    computer.write(params[2], params[0] * params[1]);
    return true;
  }),
  // input
  new Op(3, [false], (computer, params) => {
    computer.write(params[0], computer.input.shift());
    return true;
  }),
  // output
  new Op(4, [true], (computer, params) => {
    computer.output.push(params[0]);
    return true;
  }),
  // jump-if-true
  new Op(5, [true, true], (computer, params) => {
    return params[0] !== 0 ? params[1] : true;
  }),
  // jump-if-false
  new Op(6, [true, true], (computer, params) => {
    return params[0] === 0 ? params[1] : true;
  }),
  // less than
  new Op(7, [true, true, false], (computer, params) => {
    computer.write(params[2], params[0] < params[1] ? 1 : 0);
    return true;
  }),
  // equals
  new Op(8, [true, true, false], (computer, params) => {
    computer.write(params[2], params[0] === params[1] ? 1 : 0);
    return true;
  }),
  new Op(99, [], (computer, params) => {
    return false;
  }),
];

const OPS_BY_OPCODE: Map<number, Op> = new Map();
OPS.forEach(op => OPS_BY_OPCODE.set(op.opcode, op));

export class IntCodeComputer {
  pc: number = 0;
  memory: number[];
  input: number[] = []
  output: number[] = []

  constructor(memory: number[]) {
    this.memory = memory.slice(0);
  }

  private checkAddress(address: number) {
    if (address < 0 || address >= this.memory.length) {
      throw "invalid address: " + address;
    }
  }

  read(address: number) {
    this.checkAddress(address);
    return this.memory[address];
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

    const params = [];

    const paramCount = op.paramDecode.length;
    let decodeInfo = Math.floor(opcode / 100);
    for (let i = 0; i < paramCount; ++i) {
      const readValue = this.read(this.pc + i + 1);
      if (op.paramDecode[i]) {
        switch (decodeInfo % 10) {
          case 0:
            params.push(this.read(readValue));
            break;
          case 1:
            params.push(readValue);
            break;
          default:
            throw "invalid decode info in opcode " + opcode + " at " + this.pc + ", i = " + i;
        }
      }
      else {
        params.push(readValue);
      }

      decodeInfo = Math.floor(decodeInfo / 10);
    }

    //p(this.memory);
    //p(`pc: ${this.pc}, op: ${opcode}, params: ${params}`);

    const result = op.op(this, params);
    if (result === true) {
      this.pc += paramCount + 1;
    }
    else if (typeof result === "number") {
      this.pc = result;
    }

    return result !== false;
  }

  run() {
    while (this.step()) { }
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
