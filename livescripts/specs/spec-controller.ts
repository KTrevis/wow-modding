import { AddonPrefix } from "../../shared/prefix";
import { buildSpecPayload } from "./spec-payload-builder";
import { CLASSES_SPECS } from "./spec-list";

export const SPECS_CONTROLLER = {
  sendList(player: TSPlayer): void {
    const specs = CLASSES_SPECS[player.GetClass()] || [];
    player.SendAddonMessage(AddonPrefix.SPECS_LIST, buildSpecPayload(specs), 0, player);
  },
};
