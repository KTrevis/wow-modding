import { std } from "wow/wotlk";
import {
  INFINITE_DURATION_ID,
  ONE_SECOND,
} from "../../utils/constants/duration.constants";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "LONGER_ARCANE_MISSILES";
const ARCANE_MISSILES = std.Spells.load(5144);

export const LONGER_ARCANE_MISSILES = std.Spells.create(MODULE_NAME, ID)
  .Family.set(ARCANE_MISSILES.Family.get())
  .Tags.addUnique(MODULE_NAME, ID)
  .Name.enGB.set("Longer Arcane Missiles")
  .Description.enGB.set(
    "Arcane Missiles (Rank 2) shoots 1 additional projectile.",
  )
  .AuraDescription.enGB.set(
    "Arcane Missiles (Rank 2) shoots 1 additional projectile.",
  )
  .Duration.setSimple(ONE_SECOND * 10)
  .Icon.setPath("spell_nature_starfall")
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .ClassMask.A.set(ARCANE_MISSILES.ClassMask.A.get())
      .ClassMask.B.set(ARCANE_MISSILES.ClassMask.B.get())
      .ClassMask.C.set(ARCANE_MISSILES.ClassMask.C.get())
      .ImplicitTargetA.UNIT_CASTER.set()
      .Aura.ADD_FLAT_MODIFIER.set()
      .Operation.DURATION.set()
      .PointsBase.set(1000),
  )
  .Proc.mod((proc) =>
    proc.Charges.set(1)
      .Chance.set(100)
      .SpellFamily.set(ARCANE_MISSILES.Family.get())
      .ClassMask.A.set(ARCANE_MISSILES.ClassMask.A.get())
      .ClassMask.B.set(ARCANE_MISSILES.ClassMask.B.get())
      .ClassMask.C.set(ARCANE_MISSILES.ClassMask.C.get())
      .AttributesMask.REQUIRE_SPELL_MOD.set(true)
      .TriggerMask.DONE_SPELL_NONE_DAMAGE_CLASS_NEGATIVE.set(true)
      .TypeMask.DAMAGE.set(true)
      .PhaseMask.CAST.set(true),
  );
