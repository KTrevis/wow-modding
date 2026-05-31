import { createGoalsUi } from "./goal-ui";
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_WIDTH,
  CATEGORY_BUTTON_GAP,
  CATEGORY_BUTTON_HEIGHT,
  insetBackdrop,
} from "./goal-style";
import type { CategoryButton, GoalCard } from "./goal-types";
import { AddonPrefix } from "../../shared/prefix";
import { Goal } from "../../shared/goal/goal.types";
import { parseGoal } from "./goal-parse";
import { createGoalCard } from "./goal-card";

type BackdropButton = WoWAPI.Button & {
  SetBackdropBorderColor(r: number, g: number, b: number, a: number): void;
};

export class GoalController {
  private goals: Goal[] = [];
  private readonly cards: GoalCard[] = [];
  private readonly categoryButtons: CategoryButton[] = [];
  private readonly ui = createGoalsUi();
  private selectedCategory = "";

  constructor() {
    this.bindEvents();
  }

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

  private getCategoryButton(index: number): CategoryButton {
    if (!this.categoryButtons[index]) {
      const frame = CreateFrame(
        "Button",
        `NikevGoalCategory${index + 1}`,
        this.ui.scrollChild,
      ) as BackdropButton;
      frame.SetSize(CARD_WIDTH, CATEGORY_BUTTON_HEIGHT);
      frame.SetBackdrop(insetBackdrop);
      frame.SetBackdropColor(0.02, 0.02, 0.02, 0.82);
      frame.SetBackdropBorderColor(0.75, 0.72, 0.64, 1);
      frame.SetScript("OnEnter", () => {
        frame.SetBackdropColor(0.08, 0.07, 0.03, 0.92);
        frame.SetBackdropBorderColor(1, 0.82, 0.28, 1);
      });
      frame.SetScript("OnLeave", () => {
        frame.SetBackdropColor(0.02, 0.02, 0.02, 0.82);
        frame.SetBackdropBorderColor(0.75, 0.72, 0.64, 1);
      });

      const label = frame.CreateFontString(undefined, "OVERLAY", "GameFontNormal");
      label.SetPoint("TOPLEFT", frame, "TOPLEFT", 18, -10);
      label.SetWidth(CARD_WIDTH - 36);
      label.SetJustifyH("LEFT");

      const summary = frame.CreateFontString(
        undefined,
        "OVERLAY",
        "GameFontHighlightSmall",
      );
      summary.SetPoint("TOPLEFT", label, "BOTTOMLEFT", 0, -6);
      summary.SetWidth(CARD_WIDTH - 36);
      summary.SetJustifyH("LEFT");

      this.categoryButtons[index] = { frame, label, summary };
    }

    return this.categoryButtons[index];
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

  private bindEvents(): void {
    this.ui.backButton.SetScript("OnClick", () => {
      this.selectedCategory = "";
      this.render();
    });

    this.ui.frame.SetScript("OnEvent", (_self, _event, prefix, message) => {
      if (prefix !== AddonPrefix.GOAL_ITEM) {
        return;
      }

      const goal = parseGoal(message);
      if (!goal) {
        return;
      }

      this.upsertGoal(goal);
    });
  }

  private getCategories(): string[] {
    const categories: string[] = [];

    for (const goal of this.goals) {
      if (categories.indexOf(goal.category) === -1) {
        categories.push(goal.category);
      }
    }

    return categories;
  }

  private sortGoals(goals: Goal[]): Goal[] {
    return [...goals].sort((a, b) => {
      if (a.claimed === b.claimed) {
        return this.clampProgress(b) - this.clampProgress(a);
      }

      return a.claimed ? 1 : -1;
    });
  }

  private getVisibleGoals(): Goal[] {
    return this.sortGoals(this.goals).filter(
      (goal) => goal.category === this.selectedCategory,
    );
  }

  private getCategoryGoals(category: string): Goal[] {
    return this.goals.filter((goal) => goal.category === category);
  }

  private hideCards(): void {
    for (const card of this.cards) {
      card.frame.Hide();
    }
  }

  private hideCategoryButtons(): void {
    for (const button of this.categoryButtons) {
      button.frame.Hide();
    }
  }

  private renderCategoryButton(
    button: CategoryButton,
    category: string,
    index: number,
  ): void {
    const goals = this.getCategoryGoals(category);
    const claimed = goals.filter((goal) => goal.claimed).length;
    const completed = goals.filter((goal) => this.isComplete(goal)).length;

    button.frame.ClearAllPoints();
    button.frame.SetPoint(
      "TOPLEFT",
      this.ui.scrollChild,
      "TOPLEFT",
      0,
      -index * (CATEGORY_BUTTON_HEIGHT + CATEGORY_BUTTON_GAP),
    );
    button.frame.SetScript("OnClick", () => {
      this.selectedCategory = category;
      this.render();
    });
    button.label.SetText(category);
    button.summary.SetText(`${claimed}/${goals.length} claimed, ${completed} complete`);
    button.frame.Show();
  }

  private renderCategories(categories: string[]): void {
    this.ui.header.SetText("Goals");
    this.ui.backButton.Hide();
    this.ui.emptyText.Hide();
    this.ui.scrollFrame.Show();
    this.hideCards();

    for (let i = 0; i < categories.length; i++) {
      this.renderCategoryButton(this.getCategoryButton(i), categories[i], i);
    }

    for (let i = categories.length; i < this.categoryButtons.length; i++) {
      this.categoryButtons[i].frame.Hide();
    }

    const height =
      categories.length * CATEGORY_BUTTON_HEIGHT +
      Math.max(0, categories.length - 1) * CATEGORY_BUTTON_GAP;
    this.ui.scrollChild.SetHeight(height);
    this.ui.scrollFrame.SetVerticalScroll(0);
  }

  private renderGoals(): void {
    this.ui.header.SetText(this.selectedCategory);
    this.ui.backButton.Show();
    this.hideCategoryButtons();
    this.hideCards();

    const visibleGoals = this.getVisibleGoals();

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

  private upsertGoal(goal: Goal): void {
    const index = this.goals.findIndex((curr) => curr.id === goal.id);

    if (index === -1) {
      this.goals.push(goal);
    } else {
      this.goals[index] = goal;
    }

    this.render();
  }

  addGoal(newGoal: Goal) {
    this.upsertGoal(newGoal);
  }

  render(): void {
    const categories = this.getCategories();

    if (
      this.selectedCategory !== "" &&
      categories.indexOf(this.selectedCategory) === -1
    ) {
      this.selectedCategory = "";
    }

    if (this.goals.length === 0) {
      this.ui.header.SetText("Goals");
      this.ui.backButton.Hide();
      this.hideCards();
      this.hideCategoryButtons();
      this.ui.emptyText.Show();
      this.ui.scrollFrame.Hide();
      return;
    }

    if (this.selectedCategory === "") {
      this.renderCategories(categories);
      return;
    }

    this.renderGoals();
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
    if (!goal) {
      print("Goal not found.");
      return;
    }

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
