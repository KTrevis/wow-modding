import { AddonPrefix } from "../../../shared/prefix";
import { AccountGoalStore } from "../account-goal-store";
import { buildGoalPayload } from "../goal-payload-builder";
import { createLevelGoal } from "./level-goal";
import { createGoalForEveryProfession } from "./profession-goal";

export type ServerGoal = {
  id: string;
  category: string;
  title: string;
  description: string;
  current: (player: TSPlayer) => number;
  required: number;
  reward: (player: TSPlayer) => void;
  isCompleted: (player: TSPlayer) => boolean;
};

export const GOAL_LIST: ServerGoal[] = [
  createLevelGoal(10),
  createLevelGoal(20),
  ...createGoalForEveryProfession(75),
];

createGoalForEveryProfession(75);
