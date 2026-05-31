import { AddonPrefix } from "../../shared/prefix";
import type { ClientSpec } from "../../shared/specs/spec.types";
import { parseSpecs } from "./spec-parse";
import { createSpecsUi, positionSpecButton } from "./spec-ui";

export class SpecController {
  private readonly eventFrame = CreateFrame("Frame");
  private readonly ui = createSpecsUi();
  private readonly buttons: WoWAPI.Button[] = [];
  private specs: ClientSpec[] = [];

  constructor() {
    this.bindEvents();
  }

  private getButton(index: number): WoWAPI.Button {
    if (!this.buttons[index]) {
      this.buttons[index] = CreateFrame(
        "Button",
        `NikevSpecButton${index + 1}`,
        this.ui.buttonParent,
        "UIPanelButtonTemplate",
      );
    }

    return this.buttons[index];
  }

  private requestSpecs(): void {
    SendAddonMessage(AddonPrefix.SPECS_READY, "", "WHISPER", UnitName("player"));
  }

  private bindEvents(): void {
    this.eventFrame.RegisterEvent("PLAYER_LOGIN");
    this.eventFrame.RegisterEvent("CHAT_MSG_ADDON");

    this.eventFrame.SetScript("OnEvent", (_self, event, prefix, message) => {
      if (event === "PLAYER_LOGIN") {
        this.requestSpecs();
        return;
      }

      if (prefix !== AddonPrefix.SPECS_LIST) {
        return;
      }

      this.setSpecs(parseSpecs(message));
    });
  }

  private setSpecs(specs: ClientSpec[]): void {
    this.specs = specs;

    for (const spec of this.specs) {
      print(`[NikevSpecs] ${spec.name} (${spec.id})`);
    }

    this.render();
    this.show();
  }

  private render(): void {
    if (this.specs.length === 0) {
      this.ui.emptyText.Show();
    } else {
      this.ui.emptyText.Hide();
    }

    for (let i = 0; i < this.specs.length; i++) {
      const spec = this.specs[i];
      const button = this.getButton(i);

      positionSpecButton(button, this.ui.buttonParent, i);
      button.SetText(spec.name);
      button.SetScript("OnClick", () => print(`[NikevSpecs] selected ${spec.name}`));
      button.Show();
    }

    for (let i = this.specs.length; i < this.buttons.length; i++) {
      this.buttons[i].Hide();
    }
  }

  getSpecs(): ClientSpec[] {
    return this.specs;
  }

  show(): void {
    this.ui.frame.Show();
  }

  hide(): void {
    this.ui.frame.Hide();
  }

  toggle(): void {
    if (this.ui.frame.IsShown()) {
      this.hide();
    } else {
      this.show();
    }
  }
}
