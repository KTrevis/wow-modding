import { AddonPrefix } from "../../shared/prefix";
import { getAddonMessageBody } from "../livescripts";
import { GoalId, GOALS_CONTROLLER } from "./goal-list";

export function goalLivescript(events: TSEvents) {
  events.Player.OnSay((player) => {
    GOALS_CONTROLLER.sendList(player);
  });

  events.Player.OnWhisper((sender, receiver, message) => {
    if (sender !== receiver) {
      return;
    }
    const id = getAddonMessageBody(
      message.get(),
      AddonPrefix.GOAL_CLAIM,
    ) as GoalId;

    if (!id) {
      return;
    }

    if (!GOALS_CONTROLLER.isCompleted(sender, id)) {
      return;
    }
    GOALS_CONTROLLER.claim(sender, id);
  });
}
