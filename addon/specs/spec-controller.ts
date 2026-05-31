import { AddonPrefix } from "../../shared/prefix";
import {
  parseActionBarSlotPayload,
  type SpecActionBarSlot,
} from "../../shared/specs/actionbar-types";
import type { ClientSpec } from "../../shared/specs/spec.types";
import {
  clearActionBar,
  placeActionBarSlot,
  sendActionBarSnapshot,
} from "./spec-actionbar";
import { parseSpecs } from "./spec-parse";
import { createSpecsUi, positionSpecButton } from "./spec-ui";

export class SpecController {
  private readonly eventFrame = CreateFrame("Frame");
  private readonly ui = createSpecsUi();
  private readonly buttons: WoWAPI.Button[] = [];
  private specs: ClientSpec[] = [];
  private pendingActionBarSlots: SpecActionBarSlot[] = [];

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
    SendAddonMessage(
      AddonPrefix.SPECS_READY,
      "",
      "WHISPER",
      UnitName("player"),
    );
  }

  private switchSpec(spec: ClientSpec): void {
    sendActionBarSnapshot(spec.id);
  }

  private beginActionBarLoad(): void {
    this.pendingActionBarSlots = [];
    clearActionBar();
  }

  private queueActionBarSlot(payload: string): void {
    const slot = parseActionBarSlotPayload(payload);

    if (slot === undefined) {
      return;
    }

    this.pendingActionBarSlots.push(slot);
  }

  private finishActionBarLoad(): void {
    for (const slot of this.pendingActionBarSlots) {
      placeActionBarSlot(slot);
    }

    this.pendingActionBarSlots = [];
  }

  private bindEvents(): void {
    this.eventFrame.RegisterEvent("PLAYER_LOGIN");
    this.eventFrame.RegisterEvent("CHAT_MSG_ADDON");

    this.eventFrame.SetScript("OnEvent", (_self, event, prefix, message) => {
      if (event === "PLAYER_LOGIN") {
        this.requestSpecs();
        return;
      }

      if (prefix === AddonPrefix.SPECS_LIST) {
        this.setSpecs(parseSpecs(message));
      } else if (prefix === AddonPrefix.SPEC_BAR_LOAD) {
        this.beginActionBarLoad();
      } else if (prefix === AddonPrefix.SPEC_BAR_SLOT) {
        this.queueActionBarSlot(message);
      } else if (prefix === AddonPrefix.SPEC_BAR_DONE) {
        this.finishActionBarLoad();
      }
    });
  }

  private setSpecs(specs: ClientSpec[]): void {
    this.specs = specs;

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
      button.SetScript("OnClick", () => this.switchSpec(spec));
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
