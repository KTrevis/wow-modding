import { AddonPrefix } from "../../shared/prefix";
import { GOALS_CONTROLLER } from "./goal-list";

function getAddonMessageBody(
  message: string,
  prefix: AddonPrefix,
): string | undefined {
  if (!message.startsWith(prefix)) {
    return undefined;
  }

  return message.substring(prefix.length + 1, message.length);
}

export function goalEntrypoint(events: TSEvents) {
  events.Player.OnLevelChanged((player) =>
    GOALS_CONTROLLER.sendGoal("level-10", player),
  );

  events.Player.OnSay((player) => {
    GOALS_CONTROLLER.sendList(player);
  });

  events.Player.OnWhisper((sender, receiver, message) => {
    if (sender !== receiver) {
      return;
    }

    const id = getAddonMessageBody(message.get(), AddonPrefix.GOAL_CLAIM);

    if (id === undefined || !GOALS_CONTROLLER.isGoalId(id)) {
      return;
    }

    if (!GOALS_CONTROLLER.isCompleted(sender, id)) {
      return;
    }

    GOALS_CONTROLLER.claim(sender, id);
  });
}
