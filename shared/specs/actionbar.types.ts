export type SpecActionType = "spell" | "item" | "macro";

export type SpecActionBarSlot = {
  slot: number;
  actionType: SpecActionType;
  actionId: number;
};
