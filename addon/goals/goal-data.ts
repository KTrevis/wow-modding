import type { Goal } from "./goal-types";

export const defaultGoals: Goal[] = [
  {
    id: "wolves",
    title: "Beginner Hunter",
    description: "Defeat wolves around Northshire.",
    current: 2,
    required: 8,
  },
  {
    id: "kobolds",
    title: "Kobold Menace",
    description: "Recover candles from kobolds.",
    current: 4,
    required: 4,
  },
  {
    id: "explore",
    title: "Explore the Area",
    description: "Discover important locations in the starting zone.",
    current: 1,
    required: 3,
  },
];
