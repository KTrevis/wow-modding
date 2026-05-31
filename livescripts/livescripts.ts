import { AccountGoalStore } from "./goals/account-goal-store";
import { goalEntrypoint } from "./goals/goal-entrypoint";
import { removeAurasOnLogout } from "./logout/remove-auras";
import { CharacterSpecStore } from "./specs/character-spec-store";
import { specEntrypoint } from "./specs/spec-entrypoint";

export function Main(events: TSEvents) {
  AccountGoalStore.ensureTable();
  CharacterSpecStore.ensureTable();
  goalEntrypoint(events);
  specEntrypoint(events);
  removeAurasOnLogout(events);
}
