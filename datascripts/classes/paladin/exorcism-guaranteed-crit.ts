import { std } from "wow/wotlk";
import { INFINITE_DURATION_ID } from "../../utils/constants/duration.constants";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "EXORCISM_GUARANTED_CRIT_";

const EXORCISM = std.Spells.load(879);

const GUARANTEED_EXORCISM_CRIT = std.Spells.create(MODULE_NAME, ID + "PROC")
  .Family.set(EXORCISM.Family.get())
  .Name.enGB.set("Exorcism crit")
  .Proc.mod((proc) =>
    proc.ClassMask.A.set(EXORCISM.ClassMask.A.get())
      .ClassMask.B.set(EXORCISM.ClassMask.B.get())
      .ClassMask.C.set(EXORCISM.ClassMask.C.get())
      .SpellFamily.set(EXORCISM.Family.get())
      .TriggerMask.set(0x00010000)
      .PhaseMask.HIT.set(true)
      .Chance.set(100),
  )
  .Duration.set(INFINITE_DURATION_ID)
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .ClassMask.A.set(EXORCISM.ClassMask.A.get())
      .ClassMask.B.set(EXORCISM.ClassMask.B.get())
      .ClassMask.C.set(EXORCISM.ClassMask.C.get())
      .ImplicitTargetA.UNIT_CASTER.set()
      .Aura.ADD_FLAT_MODIFIER.set()
      .Operation.CRITICAL_CHANCE.set()
      .PointsBase.set(99),
  )
  .Description.enGB.set("Exorcism always treats the target as Undead or Demon.")
  .Attributes.HIDE_FROM_AURA_BAR.set(true);

std.Items.create(MODULE_NAME, ID + "ITEM")
  .InventoryType.TRINKET.set()
  .Name.enGB.set("Guaranteed Exorcism Crit")
  .Quality.ORANGE.set()
  .Spells.addMod((itemSpell) =>
    itemSpell.Spell.set(GUARANTEED_EXORCISM_CRIT.ID).Trigger.ON_EQUIP.set(),
  )
  .DisplayInfo.setSimpleIcon(
    MODULE_NAME,
    ID + "ITEM_ICON",
    "inv_zulgurubtrinket",
  )
  .ClassMask.set(0)
  .ClassMask.PALADIN.set(true);
