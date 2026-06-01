import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";
import { copySkillLines } from "../../utils/skill-lines";

const ID = "WARRIOR_REND_";

const OG_REND = std.Spells.load(772);

const NEW_REND = std.Spells.create(MODULE_NAME, ID + "SPELL", OG_REND.ID)
  .Tags.addUnique(MODULE_NAME, ID + "UTAG")
  .Subtext.enGB.set("");

copySkillLines(NEW_REND, OG_REND);
