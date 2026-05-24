import { std } from "wow/wotlk";

const DISENGAGE = std.Spells.load(781).InlineScripts.OnCheckCast((_, result) =>
  result.set(SpellCastResult.CAST_OK),
);

const description = DISENGAGE.Description.enGB.get().split(".")[0] + ".";

DISENGAGE.Description.enGB.set(description);
