import { AddonPrefix } from "../../shared/prefix";
import type { SpecActionBarSlot } from "../../shared/specs/actionbar.types";
import { SPECS_CONTROLLER } from "./spec-controller";

type PendingSpecSwitch = {
  specId: string;
  actionBarSlots: SpecActionBarSlot[];
};

const pendingSwitches: Record<number, PendingSpecSwitch> = {};

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

function parseActionBarSlot(payload: string): SpecActionBarSlot | undefined {
  const split = payload.split("|");
  const slot = Number(split[0]);
  const actionType = split[1] as SpecActionBarSlot["actionType"];
  const actionId = Number(split[2]);

  if (
    slot !== slot ||
    actionId !== actionId ||
    (actionType !== "spell" && actionType !== "item" && actionType !== "macro")
  ) {
    return undefined;
  }

  return { slot, actionType, actionId };
}

function beginSpecSwitch(player: TSPlayer, specId: string): void {
  pendingSwitches[player.GetGUIDLow()] = { specId, actionBarSlots: [] };
}

function addActionBarSlot(player: TSPlayer, payload: string): void {
  const pending = pendingSwitches[player.GetGUIDLow()];

  if (pending === undefined) {
    return;
  }

  const slot = parseActionBarSlot(payload);

  if (slot !== undefined) {
    pending.actionBarSlots.push(slot);
  }
}

function finishSpecSwitch(player: TSPlayer): void {
  const characterId = player.GetGUIDLow();
  const pending = pendingSwitches[characterId];

  if (pending === undefined) {
    return;
  }

  SPECS_CONTROLLER.switchSpec(player, pending.specId, pending.actionBarSlots);
  delete pendingSwitches[characterId];
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
      beginSpecSwitch(sender, switchSpecId);
      return;
    }

    const actionBarSlot = getAddonMessageBody(addonMessage, AddonPrefix.SPEC_BAR_SLOT);

    if (actionBarSlot !== undefined) {
      addActionBarSlot(sender, actionBarSlot);
      return;
    }

    if (getAddonMessageBody(addonMessage, AddonPrefix.SPEC_BAR_DONE) !== undefined) {
      finishSpecSwitch(sender);
    }
  });
}
