import { AddonPrefix } from "../../shared/prefix";
import { SPECS_CONTROLLER } from "./spec-controller";

function isSpecsReadyMessage(message: string): boolean {
  return (
    message === AddonPrefix.SPECS_READY ||
    message.startsWith(`${AddonPrefix.SPECS_READY}\t`)
  );
}

function getAddonMessageBody(
  message: string,
  prefix: AddonPrefix,
): string | undefined {
  if (message === prefix) {
    return "";
  }

  if (!message.startsWith(`${prefix}\t`)) {
    return undefined;
  }

  return message.substring(prefix.length + 1, message.length);
}

export function specEntrypoint(events: TSEvents): void {
  events.Player.OnWhisper((sender, receiver, message) => {
    if (sender !== receiver) {
      return;
    }

    const addonMessage = message.get();

    if (isSpecsReadyMessage(addonMessage)) {
      SPECS_CONTROLLER.sendList(sender);
      return;
    }

    const switchSpecId = getAddonMessageBody(addonMessage, AddonPrefix.SWITCH_SPEC);

    if (switchSpecId !== undefined) {
      SPECS_CONTROLLER.switchSpec(sender, switchSpecId);
    }
  });
}
