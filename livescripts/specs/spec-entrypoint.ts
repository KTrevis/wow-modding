import { AddonPrefix } from "../../shared/prefix";
import {
  parseActionBarSlotPayload,
  type SpecActionBarSlot,
} from "../../shared/specs/actionbar-types";
import { CharacterSpecStore } from "./character-spec-store";
import { SPECS_CONTROLLER } from "./spec-controller";
import { CLASSES_SPECS } from "./spec-list";

type PendingSpecSwitch = {
  specId: string;
  actionBarSlots: SpecActionBarSlot[];
};

const pendingSwitches: Record<number, PendingSpecSwitch> = {};

const ADDON_PREFIXES = [
  AddonPrefix.SPECS_READY,
  AddonPrefix.SWITCH_SPEC,
  AddonPrefix.SPEC_BAR_SLOT,
  AddonPrefix.SPEC_BAR_DONE,
];

function getAddonMessagePrefix(message: string): AddonPrefix | undefined {
  return ADDON_PREFIXES.find(
    (prefix) => message === prefix || message.startsWith(`${prefix}\t`),
  );
}

function getAddonMessageBody(
  message: string,
  prefix: AddonPrefix,
): string | undefined {
  if (getAddonMessagePrefix(message) !== prefix) {
    return undefined;
  }

  return message.substring(prefix.length + 1, message.length);
}

function beginSpecSwitch(player: TSPlayer, specId: string): void {
  pendingSwitches[player.GetGUIDLow()] = { specId, actionBarSlots: [] };
}

function addActionBarSlot(player: TSPlayer, payload: string): void {
  const pending = pendingSwitches[player.GetGUIDLow()];

  if (pending === undefined) {
    return;
  }

  const slot = parseActionBarSlotPayload(payload);

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

function initializeFirstSpec(player: TSPlayer): void {
  const characterId = player.GetGUIDLow();

  if (CharacterSpecStore.get(characterId) !== undefined) {
    return;
  }

  const firstSpec = CLASSES_SPECS[player.GetClass() as Class]?.specs[0];

  if (firstSpec === undefined) {
    return;
  }

  CharacterSpecStore.save(characterId, firstSpec.id);
  SPECS_CONTROLLER.learnSpecSpells(player, firstSpec.id);
}

export function specEntrypoint(events: TSEvents): void {
  // events.Player.OnLogin((player, firstLogin) => {
  //   if (firstLogin) {
  //     initializeFirstSpec(player);
  //   }
  // });

  events.Player.OnLevelChanged((player) => {
    const specId = CharacterSpecStore.get(player.GetGUIDLow());

    if (!specId) {
      return;
    }
    SPECS_CONTROLLER.learnSpecSpells(player, specId);
  });

  events.Player.OnWhisper((sender, receiver, message) => {
    if (sender !== receiver) {
      return;
    }

    const addonMessage = message.get();
    const prefix = getAddonMessagePrefix(addonMessage);

    switch (prefix) {
      case AddonPrefix.SPECS_READY:
        SPECS_CONTROLLER.sendList(sender);
        break;
      case AddonPrefix.SWITCH_SPEC:
        beginSpecSwitch(
          sender,
          getAddonMessageBody(addonMessage, AddonPrefix.SWITCH_SPEC) || "",
        );
        break;
      case AddonPrefix.SPEC_BAR_SLOT:
        addActionBarSlot(
          sender,
          getAddonMessageBody(addonMessage, AddonPrefix.SPEC_BAR_SLOT) || "",
        );
        break;
      case AddonPrefix.SPEC_BAR_DONE:
        finishSpecSwitch(sender);
        break;
    }
  });
}
