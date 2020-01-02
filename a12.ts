import { p, readLines, sum } from "./util";

const input = readLines('input/a12.txt');

class Moon {
  constructor(public x: number, public y: number, public z: number,
    public velX = 0, public velY = 0, public velZ = 0) { }

  applyGravity(otherMoon: Moon) {
    this.velX += Math.sign(otherMoon.x - this.x);
    this.velY += Math.sign(otherMoon.y - this.y);
    this.velZ += Math.sign(otherMoon.z - this.z);
  }

  applyVelocity() {
    this.x += this.velX;
    this.y += this.velY;
    this.z += this.velZ;
  }

  get potentialEnergy() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  get kineticEnergy() {
    return Math.abs(this.velX) + Math.abs(this.velY) + Math.abs(this.velZ);
  }

  get totalEnergy() {
    return this.potentialEnergy * this.kineticEnergy;
  }
}

const moons: Moon[] = [];
const moons2: Moon[] = [];

input.forEach(line => {
  const match = /<x=([\d\-]+), y=([\d\-]+), z=([\d\-]+)>/.exec(line);
  if (match === null) {
    throw "invalid input line: " + line;
  }
  moons.push(new Moon(parseInt(match[1]), parseInt(match[2]), parseInt(match[3])))
  moons2.push(new Moon(parseInt(match[1]), parseInt(match[2]), parseInt(match[3])))
});

function doIteration(moons: Moon[]) {
  moons.forEach(moon => {
    moons.forEach(moon2 => {
      moon.applyGravity(moon2);
    });
  });
  moons.forEach(moon => {
    moon.applyVelocity();
  });
}

for (let i = 0; i < 1000; ++i) {
  doIteration(moons);
}

p(sum(moons.map(moon => moon.totalEnergy)));

const seenStatesX: Set<string> = new Set();
const seenStatesY: Set<string> = new Set();
const seenStatesZ: Set<string> = new Set();
while (true) {
  const stateX = moons2.map(moon => moon.x + "," + moon.velX).join(";");
  const stateY = moons2.map(moon => moon.y + "," + moon.velY).join(";");
  const stateZ = moons2.map(moon => moon.z + "," + moon.velZ).join(";");
  if (seenStatesX.has(stateX) && seenStatesY.has(stateY) && seenStatesZ.has(stateZ)) {
    break;
  }
  seenStatesX.add(stateX);
  seenStatesY.add(stateY);
  seenStatesZ.add(stateZ);
  doIteration(moons2);
}

p([seenStatesX.size, seenStatesY.size, seenStatesZ.size]);

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number) {
  return (a / gcd(a, b)) * b;
}

p(lcm(lcm(seenStatesX.size, seenStatesY.size), seenStatesZ.size));
