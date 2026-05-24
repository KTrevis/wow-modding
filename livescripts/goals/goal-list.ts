import { AddonPrefix } from "../../shared/prefix";
import { AccountGoalStore } from "./account-goal-store";
import { buildGoalPayload } from "./goal-payload-builder";

export const GOAL_KEYS = ["test"] as const;
export type GoalId = (typeof GOAL_KEYS)[number];

export type ServerGoal = {
  id: GoalId;
  title: string;
  description: string;
  current: number;
  required: number;
  reward: (player: TSPlayer) => void;
  isCompleted: (player: TSPlayer) => boolean;
};

const GOAL_LIST: ServerGoal[] = [
  {
    id: "test",
    title: "title",
    description: "description",
    current: 4,
    required: 4,
    reward(player: TSPlayer) {},
    isCompleted(player: TSPlayer) {
      return true;
    },
  },
];

export const GOALS_CONTROLLER = {
  sendList(player: TSPlayer) {
    const accountId = player.GetAccountID();

    for (const goal of GOAL_LIST) {
      if (AccountGoalStore.isClaimed(accountId, goal.id)) {
        continue;
      }
      const payload = buildGoalPayload(goal);
      player.SendAddonMessage(AddonPrefix.GOAL_ITEM, payload, 0, player);
    }
  },

  claim(player: TSPlayer, goalId: GoalId) {
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

  isCompleted(player: TSPlayer, id: GoalId): boolean {
    const goal = GOAL_LIST.find((goal) => goal.id === id);

    if (!goal) {
      return false;
    }
    return goal.isCompleted(player);
  },
};
