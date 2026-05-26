import { std } from "wow/wotlk";
import { MODULE_NAME } from "../utils/constants/module-name.constants";
import { INFINITE_DURATION_ID } from "../utils/constants/duration.constants";

const ID = "XP_BUFF_";

function createXpBuff(percent: number) {
  const id = ID + `${percent}_PERCENT`;
  const xpBuff = std.Spells.create(MODULE_NAME, id)
    .Name.enGB.set(`XP bonus`)
    .Description.enGB.set(`Experience gain increased by ${percent}% per stack`)
    .AuraDescription.enGB.set(`Experience gain increased by $s1%.`)
    .Tags.addUnique(MODULE_NAME, id)
    .Duration.set(INFINITE_DURATION_ID)
    .Stacks.set(10)
    .Icon.setPath("inv_crown_02")
    .Attributes.CANT_BE_CANCELED.set(true);

  percent -= 1;

  xpBuff.Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.MOD_XP_PCT.set()
      .PercentBase.set(percent)
      .ImplicitTargetA.UNIT_CASTER.set(),
  ).Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.MOD_XP_QUEST_PCT.set()
      .PercentBase.set(percent)
      .ImplicitTargetA.UNIT_CASTER.set(),
  );
}

export const PERCENT_XP_BUFF_10 = createXpBuff(10);
