import type { ClassSpecScaling } from "../types";
import { ARMS_SCALING } from "./arms";
import { FURY_SCALING } from "./fury";
import { PROT_SCALING } from "./prot";

export const WARRIOR_SCALING: ClassSpecScaling = {
  arms: ARMS_SCALING,
  fury: FURY_SCALING,
  prot: PROT_SCALING,
};
