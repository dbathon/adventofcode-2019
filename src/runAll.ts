import { p } from "./util/util";

for (let i = 1; i <= 25; ++i) {
  p("================== day " + i);
  require("./a" + i.toString().padStart(2, "0"));
}
