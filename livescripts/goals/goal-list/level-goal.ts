import { ONE_GOLD } from "../../utils/money";
import { UTAGS } from "../../utils/utags";
import { AccountGoalStore } from "../account-goal-store";
import { ServerGoal } from "./goal-list";

export function createLevelGoal(level: uint32): ServerGoal {
  return {
    id: `level-${level}`,
    category: "Leveling",
    title: `Reach level ${level}`,
    description:
      "Reward : future characters will start with 1 gold. This effect is stackable.",
    current: (player: TSPlayer) => player.GetLevel(),
    required: level,
    reward(player: TSPlayer, firstLogin = false) {
      if (
        AccountGoalStore.isClaimed(player.GetAccountID(), this.id) &&
        firstLogin
      ) {
        player.TryAddMoney(ONE_GOLD);
      }
    },
    isCompleted: (player: TSPlayer) => player.GetLevel() >= level,
  };
}
