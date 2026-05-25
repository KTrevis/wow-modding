import { ServerGoal } from "./goal-list";

export function createLevelGoal(level: uint32): ServerGoal {
  return {
    id: `level-${level}`,
    category: "Leveling",
    title: `Reach level ${level}`,
    description:
      "Reward : 10% experience point bonus for every character on your account.",
    current: (player: TSPlayer) => player.GetLevel(),
    required: level,
    reward(player: TSPlayer) {},
    isCompleted: (player: TSPlayer) => player.GetLevel() >= level,
  };
}
