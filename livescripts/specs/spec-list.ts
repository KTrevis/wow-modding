import { UTAGS } from "../utils/utags";

export type SpecId = "arms" | "fury" | "prot";

export type Spec = {
  readonly id: SpecId;
  readonly name: string;
  readonly spells: Record<number, readonly number[]>;
}; // number: requiredLevel, number[]: spellIds

export type ClassSpecs = {
  readonly specs: readonly Spec[];
  readonly baseline: Record<number, readonly number[]>;
};

export const CLASSES_SPECS: Record<Class, ClassSpecs> = {
  [Class.WARRIOR]: {
    baseline: {
      2: [UTAGS.WARRIOR.CHARGE],
      4: [UTAGS.WARRIOR.REND],
    },
    specs: [
      {
        id: "arms",
        name: "Arms",
        spells: {},
      },
      {
        id: "fury",
        name: "Fury",
        spells: {},
      },
      {
        id: "prot",
        name: "Protection",
        spells: {},
      },
    ],
  },
  [Class.DEATH_KNIGHT]: { baseline: {}, specs: [] },
  [Class.DRUID]: { baseline: {}, specs: [] },
  [Class.HUNTER]: { baseline: {}, specs: [] },
  [Class.MAGE]: { baseline: {}, specs: [] },
  [Class.PALADIN]: { baseline: {}, specs: [] },
  [Class.PRIEST]: { baseline: {}, specs: [] },
  [Class.ROGUE]: { baseline: {}, specs: [] },
  [Class.SHAMAN]: { baseline: {}, specs: [] },
  [Class.WARLOCK]: { baseline: {}, specs: [] },
};
