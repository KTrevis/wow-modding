// Whenever Moonfire or Rip deals damage, there is a 20% chance to restore mana.

import { std } from "wow/wotlk";
import { INFINITE_DURATION_ID } from "../../utils/constants/duration.constants";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "FREE_SHAPESHIFT_";

const PROC_CHANCE = 50;
const MANA_GAIN = 20;

const RIP = std.Spells.load(1079);

const MANA_GAIN_SPELL = std.Spells.create(
  MODULE_NAME,
  ID + "MANA_GAIN_SPELL",
  31930,
)
  .Attributes.CAN_RESTORE_SECONDARY_POWER.set(true)
  .Name.enGB.set("Mana Gain")
  .Effects.mod(0, (eff) =>
    eff.Type.ENERGIZE.set()
      .PowerType.MANA.set()
      .PowerBase.set(MANA_GAIN - 1)
      .ImplicitTargetA.UNIT_CASTER.set(),
  );

const DOT_MANA_GAIN_PROC = std.Spells.create(MODULE_NAME, ID + "PROC")
  .Family.set(RIP.Family.get())
  .Name.enGB.set("Druid Dot Proc Mana Regen")
  .Proc.mod((proc) =>
    proc.ClassMask.A.set(RIP.ClassMask.A.get())
      .ClassMask.B.set(RIP.ClassMask.B.get())
      .ClassMask.C.set(RIP.ClassMask.C.get())
      .SpellFamily.set(RIP.Family.get())
      .TriggerMask.TAKEN_DAMAGE.set(true)
      .PhaseMask.HIT.set(true)
      .Chance.set(PROC_CHANCE),
  )
  .Description.enGB.set(
    `Whenever Rip deals damage, you have a ${PROC_CHANCE}% chance to gain ${MANA_GAIN} mana.`,
  )
  .Duration.set(INFINITE_DURATION_ID)
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.PROC_TRIGGER_SPELL.set()
      .TriggeredSpell.set(MANA_GAIN_SPELL.ID)
      .ImplicitTargetA.UNIT_CASTER.set(),
  )
  .Attributes.HIDE_FROM_AURA_BAR.set(true);

std.Items.create(MODULE_NAME, ID + "ITEM")
  .Name.enGB.set("Rip/Moonfire proc mana")
  .InventoryType.TRINKET.set()
  .Spells.addMod((itemSpell) =>
    itemSpell.Spell.set(DOT_MANA_GAIN_PROC.ID).Trigger.ON_EQUIP.set(),
  )
  .DisplayInfo.setSimpleIcon(
    MODULE_NAME,
    ID + "ITEM_ICON",
    "inv_gizmo_runicmanainjector",
  )
  .Quality.ORANGE.set();
