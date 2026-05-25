import { Goal } from "../../shared/goal/goal.types";

const DEFAULT_CATEGORY = "General";

export function parseGoal(payload: string): Goal | null {
  const split = payload.split("|");

  if (split.length < 6) {
    return null;
  }
  return {
    id: split[0],
    title: split[1],
    description: split[2],
    current: Number(split[3]),
    required: Number(split[4]),
    claimed: split[5] === "true",
    category: split[6] || DEFAULT_CATEGORY,
  };
}
