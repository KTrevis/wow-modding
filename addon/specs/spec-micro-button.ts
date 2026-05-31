import type { SpecController } from "./spec-controller";

const SPEC_BUTTON_TEXT = "Specializations";
const SPEC_BUTTON_DESCRIPTION = "Choose your specialization.";

type MicroButton = WoWAPI.Button & {
  tooltipText?: string;
  newbieText?: string;
};

function configureTalentMicroButton(specController: SpecController): void {
  const button = _G.TalentMicroButton as MicroButton | undefined;

  if (button === undefined) {
    return;
  }

  _G.TALENTS_BUTTON = SPEC_BUTTON_TEXT;
  _G.NEWBIE_TOOLTIP_TALENTS = SPEC_BUTTON_DESCRIPTION;
  _G.ToggleTalentFrame = () => specController.toggle();

  button.tooltipText = SPEC_BUTTON_TEXT;
  button.newbieText = SPEC_BUTTON_DESCRIPTION;
  button.SetScript("OnClick", () => specController.toggle());
  button.SetScript("OnEnter", () => {
    GameTooltip.SetOwner(button, "ANCHOR_RIGHT");
    GameTooltip.SetText(SPEC_BUTTON_TEXT, 1, 1, 1);
    GameTooltip.AddLine(SPEC_BUTTON_DESCRIPTION, 1, 0.82, 0, true);
    GameTooltip.Show();
  });
  button.SetScript("OnLeave", () => GameTooltip.Hide());
}

export function replaceTalentMicroButton(specController: SpecController): void {
  const frame = CreateFrame("Frame");

  configureTalentMicroButton(specController);
  frame.RegisterEvent("PLAYER_LOGIN");
  frame.RegisterEvent("UPDATE_BINDINGS");
  frame.SetScript("OnEvent", () => configureTalentMicroButton(specController));
}
