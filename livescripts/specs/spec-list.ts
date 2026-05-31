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
};
