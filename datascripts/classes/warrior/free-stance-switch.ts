import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants/module-name.constants";

const ID = "FREE_STANCE_SWITCH_";

const FREE_STANCE_SWITCH = std.Spells.create(
  MODULE_NAME,
  ID + "SPELL",
  12678,
).Tags.addUnique(MODULE_NAME, ID + "SPELL_TAG");

FREE_STANCE_SWITCH.Effects.get(0).PointsBase.set(99);

const STANCE_NO_RANGE_ITEM = std.Items.create(MODULE_NAME, ID + "ITEM")
  .Class.MISC.set()
  .InventoryType.TRINKET.set()
  .Name.enGB.set("Free Stance Switch Ring")
  .Quality.ORANGE.set()
  .Spells.addMod((spellItem) => spellItem.Spell.set(FREE_STANCE_SWITCH.ID))
  .DisplayInfo.setSimpleIcon(
    MODULE_NAME,
    ID + "RING_ICON",
    "inv_jewelry_ring_36",
  )
  .ClassMask.set(0)
  .ClassMask.WARRIOR.set(true);

STANCE_NO_RANGE_ITEM.InlineScripts.OnEquip((item, player) => {
  const FREE_STANCE_SWITCH_ID = UTAG("nikev", "FREE_STANCE_SWITCH_SPELL_TAG");
  player.LearnSpell(FREE_STANCE_SWITCH_ID);
});

STANCE_NO_RANGE_ITEM.InlineScripts.OnUnequip((_, player) => {
  const FREE_STANCE_SWITCH_ID = UTAG("nikev", "FREE_STANCE_SWITCH_SPELL_TAG");
  player.RemoveSpell(FREE_STANCE_SWITCH_ID, true, true);
});
