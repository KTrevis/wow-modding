import { AddonPrefix } from "../../shared/prefix";
import { AccountGoalStore } from "./account-goal-store";
import { buildGoalPayload } from "./goal-payload-builder";

export const GOAL_KEYS = ["level-10"] as const;
export type GoalId = (typeof GOAL_KEYS)[number];

export type ServerGoal = {
  id: GoalId;
  title: string;
  description: string;
  current: (player: TSPlayer) => number;
  required: number;
  reward: (player: TSPlayer) => void;
  isCompleted: (player: TSPlayer) => boolean;
};

const GOAL_LIST: ServerGoal[] = [
  {
    id: "level-10",
    title: "Reach level 10",
    description:
      "Reward : 10% experience point bonus for every character on your account.",
    current: (player: TSPlayer) => player.GetLevel(),
    required: 10,
    reward(player: TSPlayer) {},
    isCompleted: (player: TSPlayer) => player.GetLevel() >= 10,
  },
];

export const GOALS_CONTROLLER = {
  isGoalId(value: string): value is GoalId {
    return GOAL_KEYS.includes(value as GoalId);
  },

  sendGoal(goalId: GoalId, player: TSPlayer) {
    const goal = GOAL_LIST.find((curr) => curr.id === goalId);
    if (!goal) {
      console.log("tried to send invalid goal id");
      return;
    }
    const payload = buildGoalPayload(goal, player);
    player.SendAddonMessage(AddonPrefix.GOAL_ITEM, payload, 0, player);
  },

  sendList(player: TSPlayer) {
    const accountId = player.GetAccountID();

    for (const goal of GOAL_LIST) {
      if (AccountGoalStore.isClaimed(accountId, goal.id)) {
        continue;
      }
      this.sendGoal(goal.id, player);
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
