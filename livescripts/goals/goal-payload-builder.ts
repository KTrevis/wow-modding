import { AccountGoalStore } from "./account-goal-store";
import { ServerGoal } from "./goal-list";

export function buildGoalPayload(goal: ServerGoal, player: TSPlayer) {
  const isClaimed = AccountGoalStore.isClaimed(player.GetAccountID(), goal.id);
  return `${goal.id}|${goal.title}|${goal.description}|${goal.current(player)}|${goal.required}|${isClaimed}`;
}
