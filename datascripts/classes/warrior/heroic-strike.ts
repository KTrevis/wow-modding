import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "heroic-strike-";

export const HEROIC_STRIKE = std.Spells.create(MODULE_NAME, ID + "spell")
  .Name.enGB.set("Heroic Strike")
  .Subtext.clear()
  .Tags.addUnique(MODULE_NAME, ID + "tag")
  .Description.enGB.set(
    "A strong attack that deals bonus melee damage scaling with your level and causes a high amount of threat.",
  )
  .Levels.Spell.set(1)
  .Levels.Base.set(1)
  .Levels.Max.set(80)
  .Power.setRage(15)
  .Attributes.NEXT_SWING.set(false)
  .Range.set(2)
  .Effects.get(0)
  .Type.SCHOOL_DAMAGE.set()
  .DamageBase.set(10)
  .ImplicitTargetA.UNIT_TARGET_ENEMY.set();
