import { p, readLines, findMax } from "./util/util";
import { Map2D } from "./util/map2D";

const input = readLines("input/a10.txt");

class Asteroid {
  constructor(readonly x: number, readonly y: number) { }
}

const asteroids: Asteroid[] = [];
const map: Map2D<Asteroid> = new Map2D();

input.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    if (char === "#") {
      const asteroid = new Asteroid(x, y);
      asteroids.push(asteroid);
      map.set(x, y, asteroid);
    }
  });
});

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function getVisibleAsteroids(asteroid: Asteroid) {
  return asteroids.filter(asteroid2 => {
    if (asteroid !== asteroid2) {
      const distX = asteroid2.x - asteroid.x;
      const distY = asteroid2.y - asteroid.y;
      const stepDivide = gcd(Math.abs(distX), Math.abs(distY));
      const stepX = distX / stepDivide;
      const stepY = distY / stepDivide;
      let x = asteroid.x;
      let y = asteroid.y;
      while (true) {
        x += stepX;
        y += stepY;
        const hit = map.get(x, y);
        if (hit === asteroid2) {
          return true;
        }
        else if (hit !== undefined) {
          //something is in the way
          return false;
        }
      }
    }
  });
}

const visibleCounts = asteroids.map(asteroid => {
  let cntVisisble = getVisibleAsteroids(asteroid).length;
  return { asteroid, cntVisisble };
});

const best = findMax(visibleCounts, element => element.cntVisisble);
p(best);

const bestAsteroid = best.maxElement!.asteroid;
const visibleFromBest = getVisibleAsteroids(bestAsteroid);

function angle(a1: Asteroid, a2: Asteroid) {
  const x1 = 0;
  const y1 = -1;
  const x2 = a2.x - a1.x;
  const y2 = a2.y - a1.y;
  // see https://math.stackexchange.com/questions/878785/how-to-find-an-angle-in-range0-360-between-2-vectors
  const dot = x1 * x2 + y1 * y2;
  const det = x1 * y2 - y1 * x2;
  const atan2 = Math.atan2(det, dot);
  return atan2 < 0 ? 2 * Math.PI + atan2 : atan2;
}

// p(angle(new Asteroid(1, 1), new Asteroid(1, 0)));
// p(angle(new Asteroid(1, 1), new Asteroid(2, 0)));
// p(angle(new Asteroid(1, 1), new Asteroid(2, 1)));
// p(angle(new Asteroid(1, 1), new Asteroid(2, 2)));
// p(angle(new Asteroid(1, 1), new Asteroid(1, 2)));
// p(angle(new Asteroid(1, 1), new Asteroid(0, 2)));
// p(angle(new Asteroid(1, 1), new Asteroid(0, 1)));
// p(angle(new Asteroid(1, 1), new Asteroid(0, 0)));

visibleFromBest.sort((a, b) => angle(bestAsteroid, a) - angle(bestAsteroid, b));

p(visibleFromBest[199]);
