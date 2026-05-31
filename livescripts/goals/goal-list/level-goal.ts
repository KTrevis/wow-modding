import { ONE_GOLD } from "../../utils/money.constants";
import { UTAGS } from "../../utils/utags";
import { AccountGoalStore } from "../account-goal-store";
import { ServerGoal } from "./goal-list";

export function createLevelGoal(level: uint32): ServerGoal {
  return {
    id: `level-${level}`,
    category: "Leveling",
    title: `Reach level ${level}`,
    description: "Reward : 1 gold.",
    current: (player: TSPlayer) => player.GetLevel(),
    required: level,
    reward(player: TSPlayer) {
      if (AccountGoalStore.isClaimed(player.GetAccountID(), this.id)) {
        player.CastSpell(player, UTAGS.PERCENT_XP_BUFF_10, true);
      }
    },
    isCompleted: (player: TSPlayer) => player.GetLevel() >= level,
  };
}
