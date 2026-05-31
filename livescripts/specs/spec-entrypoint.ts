import { AddonPrefix } from "../../shared/prefix";
import { SPECS_CONTROLLER } from "./spec-controller";

function isSpecsReadyMessage(message: string): boolean {
  return (
    message === AddonPrefix.SPECS_READY ||
    message.startsWith(`${AddonPrefix.SPECS_READY}\t`)
  );
}

export function specEntrypoint(events: TSEvents): void {
  events.Player.OnWhisper((sender, receiver, message) => {
    if (sender !== receiver || !isSpecsReadyMessage(message.get())) {
      return;
    }

    SPECS_CONTROLLER.sendList(sender);
  });
}
