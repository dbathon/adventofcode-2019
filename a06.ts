import { readLines, p } from "./util";

const lines = readLines('input/a06.txt');

const orbitMap: Map<string, string> = new Map();

lines.forEach(line => {
  const [a, b] = line.split(")");
  if (orbitMap.has(b)) {
    throw "duplicate " + b;
  }
  orbitMap.set(b, a);
});


function chain(name: string): string[] {
  const center = orbitMap.get(name);
  return center ? [center, ...chain(center)] : [];
}

function chainLength(name: string) {
  return chain(name).length;
}

let cnt = 0;
orbitMap.forEach((value, key) => {
  cnt += chainLength(key);
});

p(cnt);

const c1 = chain("SAN");
const c2 = chain("YOU");

const firstCommon = c1.find(name => c2.includes(name));

p(c1.indexOf(firstCommon) + c2.indexOf(firstCommon));
