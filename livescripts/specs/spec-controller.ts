import { AddonPrefix } from "../../shared/prefix";
import {
  buildActionBarSlotPayload,
  type SpecActionBarSlot,
} from "../../shared/specs/actionbar-types";
import { CharacterSpecActionBarStore } from "./character-spec-actionbar-store";
import { CharacterSpecStore } from "./character-spec-store";
import { buildSpecPayload } from "./spec-payload-builder";
import { CLASSES_SPECS } from "./spec-list";

export const SPECS_CONTROLLER = {
  sendList(player: TSPlayer): void {
    const specs = CLASSES_SPECS[player.GetClass()] || [];
    player.SendAddonMessage(
      AddonPrefix.SPECS_LIST,
      buildSpecPayload(specs),
      0,
      player,
    );
  },

  switchSpec(
    player: TSPlayer,
    specId: string,
    actionBarSlots: SpecActionBarSlot[],
  ): void {
    const specs = CLASSES_SPECS[player.GetClass()] || [];
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

  learnSpecSpells(player: TSPlayer, newSpecId: string, oldSpecId: string) {
    const classId = player.GetClass();
    const newSpec = CLASSES_SPECS[classId].find(
      (curr) => curr.id === newSpecId,
    );
    const oldSpec = CLASSES_SPECS[classId].find(
      (curr) => curr.id === oldSpecId,
    );

    if (!newSpec) {
      console.log("newSpec undefined");
      return;
    }
    if (!oldSpec) {
      console.log("oldSpec undefined");
      return;
    }

    for (const [_, spells] of Object.entries(oldSpec.spells)) {
      for (const curr of spells) {
        player.RemoveSpell(curr, false, false);
      }
    }

    for (const [level, spells] of Object.entries(newSpec.spells)) {
      if (player.GetLevel() >= Number(level)) {
        for (const curr of spells) {
          player.LearnSpell(curr);
        }
      }
    }
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
