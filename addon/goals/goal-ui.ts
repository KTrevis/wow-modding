import {
  CARD_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  backdrop,
} from "./goal-style";
import type { GoalsUi } from "./goal-types";

export function createGoalsUi(): GoalsUi {
  const frame = CreateFrame("Frame", "NikevGoalsFrame", UIParent);
  frame.SetSize(WINDOW_WIDTH, WINDOW_HEIGHT);
  frame.SetPoint("CENTER", UIParent, "CENTER", 0, 40);
  frame.SetBackdrop(backdrop);
  frame.SetBackdropColor(0.04, 0.04, 0.04, 0.94);
  frame.EnableMouse(true);
  frame.SetMovable(true);
  frame.RegisterForDrag("LeftButton");
  frame.SetScript("OnDragStart", () => frame.StartMoving());
  frame.SetScript("OnDragStop", () => frame.StopMovingOrSizing());
  frame.Hide();
  frame.RegisterEvent("CHAT_MSG_ADDON");

  const header = frame.CreateFontString(
    undefined,
    "OVERLAY",
    "GameFontNormalLarge",
  );
  header.SetPoint("TOPLEFT", frame, "TOPLEFT", 24, -18);
  header.SetText("Goals");

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
  emptyText.SetPoint("CENTER", frame, "CENTER", 0, -10);
  emptyText.SetText("No goals.");
  emptyText.Hide();

  const scrollFrame = CreateFrame(
    "ScrollFrame",
    "NikevGoalsScrollFrame",
    frame,
  );
  scrollFrame.SetPoint("TOPLEFT", frame, "TOPLEFT", 22, -52);
  scrollFrame.SetPoint("BOTTOMRIGHT", frame, "BOTTOMRIGHT", -28, 22);
  scrollFrame.EnableMouseWheel(true);

  const scrollChild = CreateFrame(
    "Frame",
    "NikevGoalsScrollChild",
    scrollFrame,
  );
  scrollChild.SetSize(CARD_WIDTH, 1);
  scrollFrame.SetScrollChild(scrollChild);

  scrollFrame.SetScript("OnMouseWheel", (_self, delta: number) => {
    const current = scrollFrame.GetVerticalScroll();
    const max = scrollFrame.GetVerticalScrollRange();
    const next = Math.max(0, Math.min(max, current - delta * 32));
    scrollFrame.SetVerticalScroll(next);
  });

  return { frame, emptyText, scrollFrame, scrollChild };
}
