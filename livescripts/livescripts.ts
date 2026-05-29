import { AccountGoalStore } from "./goals/account-goal-store";
import { goalEntrypoint } from "./goals/goal-entrypoint";
import { removeAurasOnLogout } from "./logout/remove-auras";

export function Main(events: TSEvents) {
  AccountGoalStore.ensureTable();
  goalEntrypoint(events);
  removeAurasOnLogout(events);
}
