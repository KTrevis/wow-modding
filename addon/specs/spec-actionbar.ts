import { AddonPrefix } from "../../shared/prefix";
import {
  buildActionBarSlotPayload,
  isSpecActionType,
  type SpecActionBarSlot,
} from "../../shared/specs/actionbar.types";

const FIRST_ACTION_SLOT = 1;
const LAST_ACTION_SLOT = 120;
const spellTooltip = CreateFrame(
  "GameTooltip",
  "NikevSpecActionBarTooltip",
  UIParent,
  "GameTooltipTemplate",
);

function getSpellIdFromActionSlot(slot: number): number | undefined {
  spellTooltip.SetOwner(UIParent, "ANCHOR_NONE");
  spellTooltip.ClearLines();
  spellTooltip.SetAction(slot as ActionBarSlotId);

  const [_name, spellId] = spellTooltip.GetSpell();
  spellTooltip.Hide();

  return Number(spellId);
}

export function captureActionBar(): SpecActionBarSlot[] {
  const slots: SpecActionBarSlot[] = [];

  for (let slot = FIRST_ACTION_SLOT; slot <= LAST_ACTION_SLOT; slot++) {
    if (HasAction(slot as ActionBarSlotId)) {
      const [actionType, actionId] = GetActionInfo(slot as ActionBarSlotId);

      if (isSpecActionType(actionType)) {
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
