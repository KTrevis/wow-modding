import type { SpecializationScalingMap } from "./types";
import { WARRIOR_SCALING } from "./warrior";

export const SPECIALIZATION_SCALING: SpecializationScalingMap = {
  [Class.WARRIOR]: WARRIOR_SCALING,
  [Class.DEATH_KNIGHT]: {},
  [Class.DRUID]: {},
  [Class.HUNTER]: {},
  [Class.MAGE]: {},
  [Class.PALADIN]: {},
  [Class.PRIEST]: {},
  [Class.ROGUE]: {},
  [Class.SHAMAN]: {},
  [Class.WARLOCK]: {},
};
