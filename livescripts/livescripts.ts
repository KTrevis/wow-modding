import { AccountGoalStore } from "./goals/account-goal-store";
import { goalEntrypoint } from "./goals/goal-entrypoint";
import { removeAurasOnLogout } from "./logout/remove-auras";
import { CharacterSpecActionBarStore } from "./specs/character-spec-actionbar-store";
import { CharacterSpecStore } from "./specs/character-spec-store";
import { specEntrypoint } from "./specs/spec-entrypoint";
import { disableTalents } from "./talents/disable-talents";

export function Main(events: TSEvents) {
  AccountGoalStore.ensureTable();
  CharacterSpecStore.ensureTable();
  CharacterSpecActionBarStore.ensureTable();
  goalEntrypoint(events);
  specEntrypoint(events);
  disableTalents(events);
  removeAurasOnLogout(events);
}
