import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "WARRIOR_CHARGE_";

std.Spells.load(11578).Tags.addUnique(MODULE_NAME, ID + "UTAG");
