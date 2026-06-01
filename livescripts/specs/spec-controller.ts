import { AddonPrefix } from "../../shared/prefix";
import {
  buildActionBarSlotPayload,
  type SpecActionBarSlot,
} from "../../shared/specs/actionbar-types";
import { CharacterSpecActionBarStore } from "./character-spec-actionbar-store";
import { CharacterSpecStore } from "./character-spec-store";
import { buildSpecPayload } from "./spec-payload-builder";
import { CLASSES_SPECS } from "./spec-list";

function learnLeveledSpells(
  player: TSPlayer,
  spellsByLevel: Record<number, readonly number[]>,
): void {
  for (const level in spellsByLevel) {
    const spells = spellsByLevel[Number(level)];
    if (player.GetLevel() >= Number(level)) {
      for (const curr of spells) {
        const alreadyKnown = player.HasSpell(curr);

        player.LearnSpell(curr);

        if (!alreadyKnown) {
          player.SendAddonMessage(
            AddonPrefix.SPEC_SPELL_LEARNED,
            `${curr}`,
            0,
            player,
          );
        }
      }
    } else {
      for (const curr of spells) {
        player.RemoveSpell(curr, false, false);
      }
    }
  }
}

export const SPECS_CONTROLLER = {
  sendList(player: TSPlayer): void {
    const specs = CLASSES_SPECS[player.GetClass() as Class]?.specs || [];
    const activeSpecId = CharacterSpecStore.get(player.GetGUIDLow());

    player.SendAddonMessage(
      AddonPrefix.SPECS_LIST,
      buildSpecPayload(specs, activeSpecId),
      0,
      player,
    );
  },

  switchSpec(
    player: TSPlayer,
    specId: string,
    actionBarSlots: SpecActionBarSlot[],
  ): void {
    const specs = CLASSES_SPECS[player.GetClass() as Class]?.specs || [];
    const spec = specs.find((curr) => curr.id === specId);

    if (spec === undefined) {
      console.log(`invalid spec switch request: ${specId}`);
      return;
    }

    const characterId = player.GetGUIDLow();
    const currentSpecId = CharacterSpecStore.get(characterId);

    if (currentSpecId === undefined) {
      CharacterSpecActionBarStore.save(characterId, spec.id, actionBarSlots);
      CharacterSpecStore.save(characterId, spec.id);
      return;
    }

    CharacterSpecActionBarStore.save(
      characterId,
      currentSpecId,
      actionBarSlots,
    );
    CharacterSpecStore.save(characterId, spec.id);

    if (currentSpecId !== spec.id) {
      this.learnSpecSpells(player, specId, currentSpecId);
      this.sendActionBar(player, spec.id);
    }
  },

  learnSpecSpells(player: TSPlayer, newSpecId: string, oldSpecId?: string) {
    const classId = player.GetClass() as Class;
    const classSpecs = CLASSES_SPECS[classId];
    const specs = classSpecs?.specs || [];
    const newSpec = specs.find((curr) => curr.id === newSpecId);
    const oldSpec = specs.find((curr) => curr.id === oldSpecId);

    if (!newSpec) {
      console.log("newSpec undefined");
      return;
    }

    if (oldSpec) {
      for (const level in oldSpec.spells) {
        const spells = oldSpec.spells[Number(level)];

        for (const curr of spells) {
          player.RemoveSpell(curr, false, false);
        }
      }
    }

    learnLeveledSpells(player, classSpecs?.baseline || {});
    learnLeveledSpells(player, newSpec.spells);
  },

  sendActionBar(player: TSPlayer, specId: string): void {
    const slots = CharacterSpecActionBarStore.load(player.GetGUIDLow(), specId);

    player.SendAddonMessage(AddonPrefix.SPEC_BAR_LOAD, specId, 0, player);

    for (const slot of slots) {
      player.SendAddonMessage(
        AddonPrefix.SPEC_BAR_SLOT,
        buildActionBarSlotPayload(slot),
        0,
        player,
      );
    }

    player.SendAddonMessage(AddonPrefix.SPEC_BAR_DONE, specId, 0, player);
  },
};
