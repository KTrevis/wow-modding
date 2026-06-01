import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "WARRIOR_CHARGE_";

const CHARGE = std.Spells.create(MODULE_NAME, ID + "SPELL", 11578)
  .Subtext.enGB.set("")
  .Effects.mod(1, (eff) =>
    eff.Type.ENERGIZE.set().PowerType.RAGE.set().PowerBase.set(150),
  )
  .Tags.addUnique(MODULE_NAME, ID + "UTAG");
