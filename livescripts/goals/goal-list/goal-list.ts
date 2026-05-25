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

const GOAL_LIST: ServerGoal[] = [
  createLevelGoal(10),
  createLevelGoal(20),
  ...createGoalForEveryProfession(75),
];

createGoalForEveryProfession(75);

export const GOALS_CONTROLLER = {
  sendGoal(goalId: string, player: TSPlayer) {
    const goal = GOAL_LIST.find((curr) => curr.id === goalId);
    if (!goal) {
      console.log("tried to send invalid goal id");
      return;
    }
    const payload = buildGoalPayload(goal, player);
    player.SendAddonMessage(AddonPrefix.GOAL_ITEM, payload, 0, player);
  },

  sendList(player: TSPlayer) {
    for (const goal of GOAL_LIST) {
      this.sendGoal(goal.id, player);
    }
  },

  claim(player: TSPlayer, goalId: string) {
    const goal = GOAL_LIST.find((goal) => goal.id === goalId);

    if (goal === undefined) {
      return;
    }

    const accountId = player.GetAccountID();

    if (AccountGoalStore.isClaimed(accountId, goal.id)) {
      return;
    }

    goal.reward(player);
    AccountGoalStore.claim(accountId, goal.id);
    this.sendList(player);
  },

  isCompleted(player: TSPlayer, id: string): boolean {
    const goal = GOAL_LIST.find((goal) => goal.id === id);

    if (!goal) {
      return false;
    }
    return goal.isCompleted(player);
  },
};
