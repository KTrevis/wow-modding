export type SpecActionType = "spell" | "item" | "macro";

export type SpecActionBarSlot = {
  slot: number;
  actionType: SpecActionType;
  actionId: number;
};

const SUPPORTED_ACTION_TYPES: SpecActionType[] = ["spell", "item", "macro"];

export function isSpecActionType(actionType: string): actionType is SpecActionType {
  return SUPPORTED_ACTION_TYPES.includes(actionType as SpecActionType);
}

export function buildActionBarSlotPayload(slot: SpecActionBarSlot): string {
  return `${slot.slot}|${slot.actionType}|${slot.actionId}`;
}

export function parseActionBarSlotPayload(
  payload: string,
): SpecActionBarSlot | undefined {
  const split = payload.split("|");
  const slot = Number(split[0]);
  const actionType = split[1];
  const actionId = Number(split[2]);

  if (
    slot !== slot ||
    actionId !== actionId ||
    actionType === undefined ||
    !isSpecActionType(actionType)
  ) {
    return undefined;
  }

  return { slot, actionType, actionId };
}
