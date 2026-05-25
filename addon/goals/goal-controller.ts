import { createGoalsUi } from "./goal-ui";
import { CARD_GAP, CARD_HEIGHT } from "./goal-style";
import type { GoalCard } from "./goal-types";
import { AddonPrefix } from "../../shared/prefix";
import { Goal } from "../../shared/goal/goal.types";
import { parseGoal } from "./goal-parse";
import { createGoalCard } from "./goal-card";

declare function PanelTemplates_SetNumTabs(
  frame: WoWAPI.Frame,
  numTabs: number,
): void;
declare function PanelTemplates_SetTab(frame: WoWAPI.Frame, id: number): void;
declare function PanelTemplates_TabResize(
  tab: WoWAPI.Button,
  padding: number,
): void;

export class GoalController {
  private goals: Goal[] = [];
  private readonly cards: GoalCard[] = [];
  private readonly categories: string[] = [];
  private readonly ui = createGoalsUi();
  private selectedCategory = "";

  private clampProgress(goal: Goal): number {
    if (goal.required <= 0) {
      return 1;
    }

    return Math.max(0, Math.min(1, goal.current / goal.required));
  }

  private isComplete(goal: Goal): boolean {
    return goal.required <= 0 || goal.current >= goal.required;
  }

  private getCard(index: number): GoalCard {
    if (!this.cards[index]) {
      this.cards[index] = createGoalCard(index + 1, this.ui.scrollChild);
    }

    return this.cards[index];
  }

  private renderCard(card: GoalCard, goal: Goal, index: number): void {
    const complete = this.isComplete(goal);
    const progress = this.clampProgress(goal);

    card.frame.ClearAllPoints();
    card.frame.SetPoint(
      "TOPLEFT",
      this.ui.scrollChild,
      "TOPLEFT",
      0,
      -index * (CARD_HEIGHT + CARD_GAP),
    );
    card.frame.Show();

    card.title.SetText(goal.title);
    card.description.SetText(goal.description);
    card.progressBar.SetValue(progress);
    card.progressText.SetText(`${goal.current}/${goal.required}`);
    card.rewardButton.SetText(goal.claimed ? "Claimed" : "Complete");
    card.rewardButton.SetScript("OnClick", () => this.claimGoal(goal.id));

    if (complete && !goal.claimed) {
      card.rewardButton.Enable();
      card.progressBar.SetStatusBarColor(0.2, 0.8, 0.35, 1);
    } else {
      card.rewardButton.Disable();
      card.progressBar.SetStatusBarColor(0.18, 0.62, 0.95, 1);
    }
  }

  private requestGoals(): void {
    SendAddonMessage(AddonPrefix.GOAL_READY, "", "WHISPER", UnitName("player"));
  }

  private ensureCategory(category: string): void {
    if (this.categories.indexOf(category) !== -1) {
      return;
    }

    const index = this.categories.length;
    this.categories.push(category);

    const tab = CreateFrame(
      "Button",
      `NikevGoalsFrameTab${index + 1}`,
      this.ui.frame,
      "CharacterFrameTabButtonTemplate",
    );
    tab.SetID(index + 1);
    tab.SetText(category);
    PanelTemplates_TabResize(tab, 0);
    tab.SetScript("OnClick", () => {
      this.selectedCategory = category;
      PanelTemplates_SetTab(this.ui.frame, index + 1);
      this.render();
    });
    tab.SetScript("OnShow", () => PanelTemplates_TabResize(tab, 0));
    if (index === 0) {
      tab.SetPoint("TOPLEFT", this.ui.frame, "BOTTOMLEFT", 16, 5);
    } else {
      tab.SetPoint("LEFT", this.ui.tabs[index - 1], "RIGHT", -16, 0);
    }
    this.ui.tabs.push(tab);

    if (this.selectedCategory === "") {
      this.selectedCategory = category;
    }
  }

  private refreshTabs(): void {
    const selectedIndex = this.categories.indexOf(this.selectedCategory);
    PanelTemplates_SetNumTabs(this.ui.frame, this.ui.tabs.length);

    if (selectedIndex !== -1) {
      PanelTemplates_SetTab(this.ui.frame, selectedIndex + 1);
    }
  }

  addGoal(newGoal: Goal) {
    if (this.goals.some((curr) => curr.id === newGoal.id)) {
      this.updateGoal(newGoal);
    } else {
      this.setGoals([...this.goals, newGoal]);
    }
  }

  render(): void {
    for (const goal of this.goals) {
      this.ensureCategory(goal.category);
    }
    this.refreshTabs();

    this.goals.sort((a, b) => {
      if (a.claimed === b.claimed) {
        return 0;
      }

      return a.claimed ? 1 : -1;
    });
    this.ui.frame.SetScript("OnEvent", (_self, _event, prefix, message) => {
      if (prefix !== AddonPrefix.GOAL_ITEM) {
        return;
      }
      const goal = parseGoal(message);

      if (!goal) {
        return;
      }

      this.addGoal(goal);
    });
    for (const card of this.cards) {
      card.frame.Hide();
    }

    const visibleGoals = this.goals.filter(
      (goal) => goal.category === this.selectedCategory,
    );

    if (visibleGoals.length === 0) {
      this.ui.emptyText.Show();
      this.ui.scrollFrame.Hide();
      return;
    }

    this.ui.emptyText.Hide();
    this.ui.scrollFrame.Show();

    for (let i = 0; i < visibleGoals.length; i++) {
      this.renderCard(this.getCard(i), visibleGoals[i], i);
    }

    const height =
      visibleGoals.length * CARD_HEIGHT +
      Math.max(0, visibleGoals.length - 1) * CARD_GAP;
    this.ui.scrollChild.SetHeight(height);
    this.ui.scrollFrame.SetVerticalScroll(0);
  }

  setGoals(nextGoals: Goal[]): void {
    this.goals = nextGoals;
    this.render();
  }

  updateGoal(updatedGoal: Goal): void {
    const index = this.goals.findIndex((curr) => curr.id === updatedGoal.id);

    if (index === -1) {
      print("tried to update goal with invalid id");
      return;
    }
    this.goals[index] = updatedGoal;

    this.render();
  }

  claimGoal(id: string): void {
    const goal = this.goals.find((goal) => goal.id === id);
    if (!this.isComplete(goal)) {
      print("Goal incomplete.");
      return;
    }

    SendAddonMessage(
      AddonPrefix.GOAL_CLAIM,
      `${id}`,
      "WHISPER",
      UnitName("player"),
    );
    goal.claimed = true;
    this.render();
    return;
  }

  show(): void {
    this.requestGoals();
    this.render();
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
