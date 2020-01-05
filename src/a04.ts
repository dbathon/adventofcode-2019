import { p } from "./util/util";

function rulesMet(pass: number, extended = false) {
  const str: string = pass + "";
  let last = -1;
  let multi = 1;
  let multis = [];
  for (let i = 0; i < str.length; ++i) {
    const digit = parseInt(str[i]);
    if (digit < last) {
      return false;
    }
    if (digit === last) {
      ++multi;
    }
    else {
      multis.push(multi);
      multi = 1;
    }
    last = digit;
  }
  multis.push(multi);
  if (extended) {
    return multis.includes(2);
  }
  else {
    return multis.filter(el => el >= 2).length > 0;
  }
}


let cnt = 0;
let cnt2 = 0;
for (let i = 136818; i <= 685979; ++i) {
  if (rulesMet(i)) {
    ++cnt;
  }
  if (rulesMet(i, true)) {
    ++cnt2;
  }
}

p(cnt);
p(cnt2);
