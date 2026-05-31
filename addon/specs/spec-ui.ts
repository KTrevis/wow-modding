import {
  SPEC_BUTTON_GAP,
  SPEC_BUTTON_HEIGHT,
  SPEC_BUTTON_WIDTH,
  SPEC_WINDOW_HEIGHT,
  SPEC_WINDOW_WIDTH,
  specBackdrop,
} from "./spec-style";

export type SpecsUi = {
  frame: WoWAPI.Frame;
  title: WoWAPI.FontString;
  emptyText: WoWAPI.FontString;
  buttonParent: WoWAPI.Frame;
};

export function createSpecsUi(): SpecsUi {
  const frame = CreateFrame("Frame", "NikevSpecsFrame", UIParent);
  frame.SetSize(SPEC_WINDOW_WIDTH, SPEC_WINDOW_HEIGHT);
  frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
  frame.SetBackdrop(specBackdrop);
  frame.SetBackdropColor(0.04, 0.04, 0.04, 0.94);
  frame.EnableMouse(true);
  frame.SetMovable(true);
  frame.RegisterForDrag("LeftButton");
  frame.SetScript("OnDragStart", () => frame.StartMoving());
  frame.SetScript("OnDragStop", () => frame.StopMovingOrSizing());
  frame.Hide();
  UISpecialFrames.push("NikevSpecsFrame");

  const title = frame.CreateFontString(undefined, "OVERLAY", "GameFontNormalLarge");
  title.SetPoint("TOP", frame, "TOP", 0, -20);
  title.SetText("Specs");

  const closeButton = CreateFrame(
    "Button",
    undefined,
    frame,
    "UIPanelCloseButton",
  );
  closeButton.SetPoint("TOPRIGHT", frame, "TOPRIGHT", -8, -8);

  const emptyText = frame.CreateFontString(
    undefined,
    "OVERLAY",
    "GameFontHighlight",
  );
  emptyText.SetPoint("CENTER", frame, "CENTER", 0, -8);
  emptyText.SetText("No specs.");
  emptyText.Hide();

  const buttonParent = CreateFrame("Frame", undefined, frame);
  buttonParent.SetSize(SPEC_BUTTON_WIDTH, SPEC_WINDOW_HEIGHT - 70);
  buttonParent.SetPoint("TOP", title, "BOTTOM", 0, -18);

  return { frame, title, emptyText, buttonParent };
}

export function positionSpecButton(
  button: WoWAPI.Button,
  parent: WoWAPI.Frame,
  index: number,
): void {
  button.ClearAllPoints();
  button.SetPoint(
    "TOP",
    parent,
    "TOP",
    0,
    -index * (SPEC_BUTTON_HEIGHT + SPEC_BUTTON_GAP),
  );
  button.SetSize(SPEC_BUTTON_WIDTH, SPEC_BUTTON_HEIGHT);
}
