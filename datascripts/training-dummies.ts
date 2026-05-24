import { std } from "wow/wotlk";
import { MODULE_NAME } from "./utils/constants/module-name.constants";

const ID = "BASE_DUMMY_";

export const BASE_DUMMY = 31144;

std.CreatureTemplates.create(MODULE_NAME, ID + "LEVEL_20", BASE_DUMMY)
  .Level.set(20, 20)
  .Spawns.add(MODULE_NAME, ID + "LEVEL_20_SPAWNS", [
    { map: 571, x: 5784.943848, y: 636.879089, z: 647.836182, o: 0.002444 },
    { map: 571, x: 5804.44043, y: 659.569885, z: 647.937317, o: 4.661232 },
    { map: 571, x: 5824.660645, y: 643.16394, z: 647.861267, o: 3.349618 },
  ]);
