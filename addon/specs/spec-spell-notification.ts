type SpellLearnedNotification = WoWAPI.Frame & {
  icon: WoWAPI.Texture;
  hideAt: number;
  hovered: boolean;
  spellId: number;
  spellNameText: WoWAPI.FontString;
  SetBackdropBorderColor(r: number, g: number, b: number, a: number): void;
};

const NOTIFICATION_WIDTH = 320;
const NOTIFICATION_HEIGHT = 58;
const NOTIFICATION_GAP = 8;
const NOTIFICATION_DURATION = 4;
const NOTIFICATION_TOP_OFFSET = -115;
const FALLBACK_SPELL_ICON = "Interface\\Icons\\INV_Misc_QuestionMark";

const notificationBackdrop = {
  bgFile: "Interface\\DialogFrame\\UI-DialogBox-Background-Dark",
  edgeFile: "Interface\\Tooltips\\UI-Tooltip-Border",
  tile: true,
  tileSize: 16,
  edgeSize: 14,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
};

export class SpellLearnedNotificationColumn {
  private readonly notifications: SpellLearnedNotification[] = [];

  show(spellId: number): void {
    const [spellName, _rank, iconTexture] = GetSpellInfo(spellId);
    const notification = this.getNotification();

    notification.spellId = spellId;
    notification.hideAt = GetTime() + NOTIFICATION_DURATION;
    notification.hovered = false;
    notification.icon.SetTexture(iconTexture || FALLBACK_SPELL_ICON);
    notification.spellNameText.SetText(spellName || `Sort ${spellId}`);
    notification.SetAlpha(1);
    notification.Show();

    this.positionVisibleNotifications();
  }

  private getNotification(): SpellLearnedNotification {
    for (const notification of this.notifications) {
      if (!notification.IsShown()) {
        return notification;
      }
    }

    const notification = this.createNotification();
    this.notifications.push(notification);

    return notification;
  }

  private createNotification(): SpellLearnedNotification {
    const frame = CreateFrame(
      "Frame",
      `NikevSpellLearnedNotification${this.notifications.length + 1}`,
      UIParent,
    ) as SpellLearnedNotification;
    frame.SetSize(NOTIFICATION_WIDTH, NOTIFICATION_HEIGHT);
    frame.SetPoint("TOP", UIParent, "TOP", 0, NOTIFICATION_TOP_OFFSET);
    frame.SetFrameStrata("HIGH");
    frame.SetBackdrop(notificationBackdrop);
    frame.SetBackdropColor(0.02, 0.02, 0.02, 0.92);
    frame.SetBackdropBorderColor(0.86, 0.68, 0.28, 1);
    frame.EnableMouse(true);
    frame.hideAt = 0;
    frame.hovered = false;
    frame.spellId = 0;
    frame.Hide();

    const icon = frame.CreateTexture(undefined, "ARTWORK");
    icon.SetSize(36, 36);
    icon.SetPoint("LEFT", frame, "LEFT", 14, 0);
    frame.icon = icon;

    const title = frame.CreateFontString(
      undefined,
      "OVERLAY",
      "GameFontNormalSmall",
    );
    title.SetPoint("TOPLEFT", icon, "TOPRIGHT", 12, -1);
    title.SetText("New spell learned");
    title.SetTextColor(1, 0.82, 0.28, 1);

    const spellNameText = frame.CreateFontString(
      undefined,
      "OVERLAY",
      "GameFontHighlightLarge",
    );
    spellNameText.SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -5);
    spellNameText.SetWidth(NOTIFICATION_WIDTH - 76);
    spellNameText.SetJustifyH("LEFT");
    frame.spellNameText = spellNameText;

    frame.SetScript("OnEnter", () => {
      frame.hovered = true;
      GameTooltip.SetOwner(frame, "ANCHOR_RIGHT");
      GameTooltip.SetSpellByID(frame.spellId);
      GameTooltip.Show();
    });
    frame.SetScript("OnLeave", () => {
      frame.hovered = false;
      frame.hideAt = GetTime() + NOTIFICATION_DURATION;
      GameTooltip.Hide();
    });
    frame.SetScript("OnUpdate", () => this.updateNotification(frame));

    return frame;
  }

  private updateNotification(notification: SpellLearnedNotification): void {
    if (notification.hovered) {
      notification.SetAlpha(1);
      return;
    }

    const remaining = notification.hideAt - GetTime();

    if (remaining <= 0) {
      notification.Hide();
      this.positionVisibleNotifications();
      return;
    }

    notification.SetAlpha(remaining < 1 ? remaining : 1);
  }

  private positionVisibleNotifications(): void {
    let visibleIndex = 0;

    for (const notification of this.notifications) {
      if (notification.IsShown()) {
        notification.ClearAllPoints();
        notification.SetPoint(
          "TOP",
          UIParent,
          "TOP",
          0,
          NOTIFICATION_TOP_OFFSET -
            visibleIndex * (NOTIFICATION_HEIGHT + NOTIFICATION_GAP),
        );
        visibleIndex++;
      }
    }
  }
}
