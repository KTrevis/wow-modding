import { Goal } from "../../shared/goal/goal.types";

const DEFAULT_CATEGORY = "General";
const LEGACY_FIELD_COUNT = 6;

const GoalPayloadIndex = {
  ID: 0,
  TITLE: 1,
  DESCRIPTION: 2,
  CURRENT: 3,
  REQUIRED: 4,
  CLAIMED: 5,
  CATEGORY: 6,
} as const;

export function parseGoal(payload: string): Goal | null {
  const split = payload.split("|");

  if (split.length < LEGACY_FIELD_COUNT) {
    return null;
  }

  const current = Number(split[GoalPayloadIndex.CURRENT]);
  const required = Number(split[GoalPayloadIndex.REQUIRED]);

  if (current !== current || required !== required) {
    return null;
  }

  return {
    id: split[GoalPayloadIndex.ID],
    title: split[GoalPayloadIndex.TITLE],
    description: split[GoalPayloadIndex.DESCRIPTION],
    current,
    required,
    claimed: split[GoalPayloadIndex.CLAIMED] === "true",
    category: split[GoalPayloadIndex.CATEGORY] || DEFAULT_CATEGORY,
  };
}
