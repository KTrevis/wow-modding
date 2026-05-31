export type Spec = {
  id: string;
  name: string;
  spells: Record<number, number[]>;
}; // number: requiredLevel, number[]: spellIds

export const CLASSES_SPECS: Record<number, Spec[]> = {
  [Class.WARRIOR]: [
    {
      id: "arms",
      name: "Arms",
      spells: {
        1: [2136],
      },
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
};
