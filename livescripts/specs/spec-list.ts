import { UTAGS } from "../utils/utags";

export type SpecId = "arms" | "fury" | "prot";

export type Spec = {
  readonly id: SpecId;
  readonly name: string;
  readonly spells: Record<number, readonly number[]>;
}; // number: requiredLevel, number[]: spellIds

export const CLASSES_SPECS: Record<Class, readonly Spec[]> = {
  [Class.WARRIOR]: [
    {
      id: "arms",
      name: "Arms",
      spells: {
        2: [UTAGS.WARRIOR.CHARGE],
      },
    },
    {
      id: "fury",
      name: "Fury",
      spells: {
        2: [UTAGS.WARRIOR.CHARGE],
      },
    },
    {
      id: "prot",
      name: "Protection",
      spells: {
        2: [UTAGS.WARRIOR.CHARGE],
      },
    },
  ],
  [Class.DEATH_KNIGHT]: [],
  [Class.DRUID]: [],
  [Class.HUNTER]: [],
  [Class.MAGE]: [],
  [Class.PALADIN]: [],
  [Class.PRIEST]: [],
  [Class.ROGUE]: [],
  [Class.SHAMAN]: [],
  [Class.WARLOCK]: [],
};
