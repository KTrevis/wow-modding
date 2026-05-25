import { AccountGoalStore } from "./goals/account-goal-store";
import { goalEntrypoint } from "./goals/goal-entrypoint";

export function Main(events: TSEvents) {
  AccountGoalStore.ensureTable();
  goalEntrypoint(events);
}
