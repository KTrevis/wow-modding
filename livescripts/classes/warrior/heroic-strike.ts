import { ClassIDs, SPELL_SCALING } from "../../spell-scaling-curves";

const WARRIOR_SCALING = SPELL_SCALING[ClassIDs.WARRIOR];

export function heroicStrikeScaling(events: TSEvents) {
  events.Spell.OnDamageEarly(
    UTAG("nikev", "heroic-strike-tag"),
    (spell, damage) => {
      const caster = ToUnit(spell.GetCaster());
      if (!caster) {
        return;
      }
      const level = Math.max(1, Math.min(80, caster.GetLevel()));
      damage.set(Math.round(WARRIOR_SCALING[level - 1] * 0.5584767617179768));
    },
  );
}
