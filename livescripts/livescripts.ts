import { AccountGoalStore } from "./goals/account-goal-store";
import { AddonPrefix } from "../shared/prefix";
import { goalLivescript } from "./goals/goal.livescript";

export function getAddonMessageBody(
  message: string,
  prefix: AddonPrefix,
): string | undefined {
  if (!message.startsWith(prefix)) {
    return undefined;
  }

  return message.substring(prefix.length + 1, message.length);
}

export function Main(events: TSEvents) {
  AccountGoalStore.ensureTable();

  goalLivescript(events);
}
