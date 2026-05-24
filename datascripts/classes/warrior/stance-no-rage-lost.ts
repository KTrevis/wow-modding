import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "STANCE_NO_RAGE_LOST_";

const STANCE_NO_RAGE = std.Spells.create(
  MODULE_NAME,
  ID + "SPELL",
  12678,
).Tags.addUnique(MODULE_NAME, ID + "SPELL_TAG");

STANCE_NO_RAGE.Effects.get(0).PointsBase.set(99);

const STANCE_NO_RANGE_ITEM = std.Items.create(MODULE_NAME, ID + "RING")
  .Class.MISC.set()
  .InventoryType.FINGER.set()
  .Name.enGB.set("Stance Mastery Ring")
  .Spells.addMod((spellItem) => spellItem.Spell.set(STANCE_NO_RAGE.ID))
  .DisplayInfo.setSimpleIcon(
    MODULE_NAME,
    ID + "RING_ICON",
    "inv_jewelry_ring_36",
  );

STANCE_NO_RANGE_ITEM.InlineScripts.OnEquip((_, player) => {
  const STANCE_NO_RAGE_ID = UTAG("nikev", "STANCE_NO_RAGE_LOST_SPELL_TAG");
  player.LearnSpell(STANCE_NO_RAGE_ID);
});

STANCE_NO_RANGE_ITEM.InlineScripts.OnUnequip((_, player) => {
  const STANCE_NO_RAGE_ID = UTAG("nikev", "STANCE_NO_RAGE_LOST_SPELL_TAG");
  player.RemoveSpell(STANCE_NO_RAGE_ID, true, true);
});
