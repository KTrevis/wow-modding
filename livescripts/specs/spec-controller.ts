import { AddonPrefix } from "../../shared/prefix";
import { CharacterSpecStore } from "./character-spec-store";
import { buildSpecPayload } from "./spec-payload-builder";
import { CLASSES_SPECS } from "./spec-list";

export const SPECS_CONTROLLER = {
  sendList(player: TSPlayer): void {
    const specs = CLASSES_SPECS[player.GetClass()] || [];
    player.SendAddonMessage(AddonPrefix.SPECS_LIST, buildSpecPayload(specs), 0, player);
  },

  switchSpec(player: TSPlayer, specId: string): void {
    const specs = CLASSES_SPECS[player.GetClass()] || [];
    const spec = specs.find((curr) => curr.id === specId);

    if (spec === undefined) {
      console.log(`invalid spec switch request: ${specId}`);
      return;
    }

    CharacterSpecStore.save(player.GetGUIDLow(), spec.id);
    console.log(`switch spec: ${spec.name}`);
  },
};
