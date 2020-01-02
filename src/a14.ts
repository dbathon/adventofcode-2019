import { p, readLines } from "./util/util";

const input = readLines('input/a14.txt');

class Reaction {
  ingredients: Map<string, number> = new Map();

  produced = 0;
  available = 0;

  constructor(readonly chemical: string, readonly quantity: number) { }

  produce(requiredQuantity: number, reactions: Map<string, Reaction>): void {
    if (this.available >= requiredQuantity) {
      this.available -= requiredQuantity;
    }
    else {
      // first use the available quantity
      requiredQuantity -= this.available;
      // now produce the rest
      const factor = Math.ceil(requiredQuantity / this.quantity);
      this.ingredients.forEach((ingredientQuantity, ingredient) => {
        reactions.get(ingredient)!.produce(ingredientQuantity * factor, reactions);
      });

      const producedQuantity = factor * this.quantity;
      this.produced += producedQuantity;
      this.available = producedQuantity - requiredQuantity;
    }
  }
}

const reactions: Map<string, Reaction> = new Map();
// add dummy ore reaction
reactions.set("ORE", new Reaction("ORE", 1));


input.forEach(line => {
  const [ingredientsString, result] = line.split(" => ");
  const ingredients = ingredientsString.split(", ");
  const parse = (str: string) => {
    const [quantity, chemical] = str.split(" ");
    return new Reaction(chemical, parseInt(quantity));
  }
  const reaction = parse(result);
  ingredients.forEach(ingredient => {
    const dummy = parse(ingredient);
    reaction.ingredients.set(dummy.chemical, dummy.quantity);
  });
  reactions.set(reaction.chemical, reaction);
});


const fuel = reactions.get("FUEL")!;
fuel.produce(1, reactions);

const ore = reactions.get("ORE")!;
const approximateOrePerFuel = ore.produced;
p(approximateOrePerFuel);

const targetOre = 1000000000000;
while (ore.produced <= targetOre) {
  const toProduce = Math.ceil(((targetOre - ore.produced) / approximateOrePerFuel) / 10);
  fuel.produce(toProduce, reactions);
}

p(fuel.produced - 1);
