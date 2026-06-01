import { Spell } from "wow/wotlk/std/Spell/Spell";

export function copySkillLines(target: Spell, origin: Spell) {
  for (const curr of origin.SkillLines.get()) {
    target.SkillLines.addMod(
      curr.SkillLine.get(),
      curr.ClassMask.get(),
      curr.RaceMask.get(),
    );
  }
}
