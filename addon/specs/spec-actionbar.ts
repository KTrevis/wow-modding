import { AddonPrefix } from "../../shared/prefix";
import type {
  SpecActionBarSlot,
  SpecActionType,
} from "../../shared/specs/actionbar.types";

const FIRST_ACTION_SLOT = 1;
const LAST_ACTION_SLOT = 120;
const SUPPORTED_ACTION_TYPES: SpecActionType[] = ["spell", "item", "macro"];
const spellTooltip = CreateFrame(
  "GameTooltip",
  "NikevSpecActionBarTooltip",
  UIParent,
  "GameTooltipTemplate",
);

function isSupportedActionType(
  actionType: string,
): actionType is SpecActionType {
  return SUPPORTED_ACTION_TYPES.includes(actionType as SpecActionType);
}

function getSpellIdFromActionSlot(slot: number): number | undefined {
  spellTooltip.SetOwner(UIParent, "ANCHOR_NONE");
  spellTooltip.ClearLines();
  spellTooltip.SetAction(slot as ActionBarSlotId);

  const [_name, _rank, spellId] = spellTooltip.GetSpell();

  return Number(spellId);
}

export function captureActionBar(): SpecActionBarSlot[] {
  const slots: SpecActionBarSlot[] = [];

  for (let slot = FIRST_ACTION_SLOT; slot <= LAST_ACTION_SLOT; slot++) {
    if (HasAction(slot as ActionBarSlotId)) {
      const [actionType, actionId] = GetActionInfo(slot as ActionBarSlotId);

      if (isSupportedActionType(actionType)) {
        const numericActionId =
          actionType === "spell"
            ? getSpellIdFromActionSlot(slot)
            : Number(actionId);

        if (
          numericActionId !== undefined &&
          numericActionId === numericActionId
        ) {
          slots.push({ slot, actionType, actionId: numericActionId });
        }
      }
    }
  }

  return slots;
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
    !isSupportedActionType(actionType)
  ) {
    return undefined;
  }

  return { slot, actionType, actionId };
}

export function clearActionBar(): void {
  for (let slot = FIRST_ACTION_SLOT; slot <= LAST_ACTION_SLOT; slot++) {
    if (HasAction(slot as ActionBarSlotId)) {
      PickupAction(slot as ActionBarSlotId);
      ClearCursor();
    }
  }
}

export function placeActionBarSlot(slot: SpecActionBarSlot): void {
  ClearCursor();

  if (slot.actionType === "spell") {
    const [spellName] = GetSpellInfo(slot.actionId);

    if (!spellName) {
      print(`[NikevSpecs] could not find spell ${slot.actionId}`);
      return;
    }

    PickupSpell(spellName);
  } else if (slot.actionType === "item") {
    PickupItem(slot.actionId);
  } else if (slot.actionType === "macro") {
    PickupMacro(slot.actionId);
  }

  PlaceAction(slot.slot as ActionBarSlotId);
  ClearCursor();
}

export function sendActionBarSnapshot(targetSpecId: string): void {
  SendAddonMessage(
    AddonPrefix.SWITCH_SPEC,
    targetSpecId,
    "WHISPER",
    UnitName("player"),
  );

  for (const slot of captureActionBar()) {
    const payload = buildActionBarSlotPayload(slot);
    SendAddonMessage(
      AddonPrefix.SPEC_BAR_SLOT,
      payload,
      "WHISPER",
      UnitName("player"),
    );
  }

  SendAddonMessage(
    AddonPrefix.SPEC_BAR_DONE,
    "",
    "WHISPER",
    UnitName("player"),
  );
}
