import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";
import { LONGER_ARCANE_MISSILES } from "./longer-arcane-missiles";
import { INFINITE_DURATION_ID } from "../../utils/constants/duration.constants";

const ID = "AM_FB_COMBO";

const FIRE_BLAST = std.Spells.load(2137);

const AM_FB_COMBO = std.Spells.create(MODULE_NAME, `${ID}_FROM_FIRE_BLAST`)
  .Family.set(FIRE_BLAST.Family.get())
  .Name.enGB.set("Arcane Missiles after Fire Blast")
  .Description.enGB.set(
    "Casting Fire Blast (Rank 2) makes your next Arcane Missiles (Rank 2) shoot an additional projectile.",
  )
  .AuraDescription.enGB.set(
    "Your next Arcane Missiles (Rank 2) shoot an additional projectile.",
  )
  .Duration.set(INFINITE_DURATION_ID)
  .Icon.setPath("spell_fire_fireball")
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .ImplicitTargetA.UNIT_CASTER.set()
      .Aura.PROC_TRIGGER_SPELL.set()
      .TriggeredSpell.set(LONGER_ARCANE_MISSILES.ID),
  )
  .Proc.mod((proc) =>
    proc.Chance.set(100)
      .SpellFamily.set(FIRE_BLAST.Family.get())
      .ClassMask.A.set(FIRE_BLAST.ClassMask.A.get())
      .ClassMask.B.set(FIRE_BLAST.ClassMask.B.get())
      .ClassMask.C.set(FIRE_BLAST.ClassMask.C.get())
      .TriggerMask.DONE_PERIODIC.set(true)
      .PhaseMask.HIT.set(true),
  )
  .Attributes.HIDE_FROM_AURA_BAR.set(true);

std.Items.create(MODULE_NAME, ID + "TRINKET")
  .InventoryType.TRINKET.set()
  .Quality.ORANGE.set()
  .Name.enGB.set("AM FB combo trinket")
  .DisplayInfo.setSimpleIcon(MODULE_NAME, ID + "icon", "inv_misc_rubysanctum4")
  .Spells.addMod((itemSpell) =>
    itemSpell.Spell.set(AM_FB_COMBO.ID).Trigger.ON_EQUIP.set(),
  )
  .ClassMask.MAGE.set(true);
