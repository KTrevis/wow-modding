import { CARD_HEIGHT, CARD_WIDTH, insetBackdrop } from "./goal-style";
import type { GoalCard } from "./goal-types";

export function createGoalCard(index: number, parent: WoWAPI.Frame): GoalCard {
  const card = CreateFrame("Frame", `NikevGoalCard${index}`, parent);
  card.SetSize(CARD_WIDTH, CARD_HEIGHT);
  card.SetBackdrop(insetBackdrop);
  card.SetBackdropColor(0.02, 0.02, 0.02, 0.82);
  (card as any).SetBackdropBorderColor(0.75, 0.72, 0.64, 1);

  const title = card.CreateFontString(undefined, "OVERLAY", "GameFontNormal");
  title.SetPoint("TOPLEFT", card, "TOPLEFT", 18, -16);
  title.SetWidth(CARD_WIDTH - 36);
  title.SetJustifyH("LEFT");

  const description = card.CreateFontString(
    undefined,
    "OVERLAY",
    "GameFontHighlightSmall",
  );
  description.SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -6);
  description.SetWidth(CARD_WIDTH - 36);
  description.SetJustifyH("LEFT");

  const progressBar = CreateFrame("StatusBar", undefined, card);
  progressBar.SetPoint("BOTTOMLEFT", card, "BOTTOMLEFT", 18, 18);
  progressBar.SetSize(330, 28);
  progressBar.SetStatusBarTexture("Interface\\TargetingFrame\\UI-StatusBar");
  progressBar.SetStatusBarColor(0.18, 0.62, 0.95, 1);
  progressBar.SetMinMaxValues(0, 1);
  progressBar.SetBackdrop(insetBackdrop);
  progressBar.SetBackdropColor(0, 0, 0, 0.7);

  const progressLabel = card.CreateFontString(
    undefined,
    "OVERLAY",
    "GameFontHighlightSmall",
  );
  progressLabel.SetPoint("BOTTOMLEFT", progressBar, "TOPLEFT", 0, 6);
  progressLabel.SetText("Progress");

  const progressText = progressBar.CreateFontString(
    undefined,
    "OVERLAY",
    "GameFontHighlight",
  );
  progressText.SetPoint("CENTER", progressBar, "CENTER", 0, 0);

  const rewardButton = CreateFrame(
    "Button",
    undefined,
    card,
    "UIPanelButtonTemplate",
  );
  rewardButton.SetPoint("LEFT", progressBar, "RIGHT", 8, 0);
  rewardButton.SetSize(120, 28);
  rewardButton.SetHeight(28);

  return {
    frame: card,
    title,
    description,
    progressLabel,
    progressBar,
    progressText,
    rewardButton,
  };
}
