import { std } from "wow/wotlk";
import { MODULE_NAME } from "../utils/constants/module-name.constants";
import { INFINITE_DURATION_ID } from "../utils/constants/duration.constants";

const ID = "XP_BUFF_";

function createXpBuff(percent: number) {
  const id = ID + `${percent}_PERCENT`;
  const xpBuff = std.Spells.create(MODULE_NAME, id)
    .Name.enGB.set(`${percent}% XP bonus`)
    .Description.enGB.set(`Experience gain increased by ${percent}%`)
    .Tags.addUnique(MODULE_NAME, id);

  percent -= 1;
  xpBuff.Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.MOD_XP_PCT.set()
      .PercentBase.set(percent)
      .ImplicitTargetA.UNIT_CASTER.set(),
  )
    .Effects.addMod((eff) =>
      eff.Type.APPLY_AURA.set()
        .Aura.MOD_XP_QUEST_PCT.set()
        .PercentBase.set(percent)
        .ImplicitTargetA.UNIT_CASTER.set(),
    )
    .Duration.set(INFINITE_DURATION_ID);
}

export const PERCENT_XP_BUFF_10 = createXpBuff(10);
