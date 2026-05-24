import { ServerGoal } from "./goal-list";

export function buildGoalPayload(goal: ServerGoal) {
  return `${goal.id}|${goal.title}|${goal.description}|${goal.current}|${goal.required}`;
}
