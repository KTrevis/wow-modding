import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "WARRIOR_REND_";

std.Spells.create(MODULE_NAME, ID + "SPELL", 772).Tags.addUnique(
  MODULE_NAME,
  ID + "UTAG",
);
