import { AddonPrefix } from "../../shared/prefix";
import { GOALS_CONTROLLER } from "./goal-list/goal-controller";
import { GOAL_LIST } from "./goal-list/goal-list";

const ADDON_PREFIXES = [
  AddonPrefix.GOAL_CLAIM,
  AddonPrefix.GOAL_ITEM,
  AddonPrefix.GOAL_READY,
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

function handleGoalClaim(player: TSPlayer, message: string): void {
  const id = getAddonMessageBody(message, AddonPrefix.GOAL_CLAIM);

  if (id === undefined) {
    return;
  }

  if (!GOALS_CONTROLLER.isCompleted(player, id)) {
    return;
  }

  GOALS_CONTROLLER.claim(player, id);
}

export function goalEntrypoint(events: TSEvents) {
  events.Player.OnLogin((player, firstLogin) => {
    player.AddNamedTimer("login-timer", 100, 1, 0, () => {
      for (const goal of GOAL_LIST) {
        goal.reward(player, firstLogin);
      }
    });
  });

  events.Player.OnWhisper((sender, receiver, message) => {
    if (sender !== receiver) {
      return;
    }

    const addonMessage = message.get();
    const prefix = getAddonMessagePrefix(addonMessage);

    switch (prefix) {
      case AddonPrefix.GOAL_READY:
        GOALS_CONTROLLER.sendList(sender);
        break;
      case AddonPrefix.GOAL_CLAIM:
        handleGoalClaim(sender, addonMessage);
        break;
    }
  });
}
