import { p, readLines, findMax, splitArray } from "./util";

const input = readLines('input/a08.txt')[0].split("");

const width = 25;
const layerLength = width * 6;

const layers = splitArray(input, layerLength);

function count(layer: string[], element: string) {
  return layer.filter(el => el === element).length;
}

const res1 = findMax(layers, (layer) => {
  return -count(layer, "0");
});

p(count(res1.maxElement, "1") * count(res1.maxElement, "2"));

const image: string[] = [];

layers.forEach(layer => {
  layer.map((pixel, index) => {
    if ((pixel === "0" || pixel === "1") && typeof image[index] === "undefined") {
      image[index] = pixel === "1" ? "X" : " ";
    }
  });
});

const lines = splitArray(image, width);
lines.forEach(line => p(line.join("")));
