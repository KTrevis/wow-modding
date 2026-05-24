import { defaultGoals } from "./goal-data";
import { createGoalCard } from "./goal-card";
import { createGoalsUi } from "./goal-ui";
import { CARD_GAP, CARD_HEIGHT } from "./goal-style";
import type { Goal, GoalCard } from "./goal-types";
import { ADDON_PREFIXES } from "../../shared/prefix";

export class GoalController {
  private goals: Goal[] = defaultGoals;
  private readonly cards: GoalCard[] = [];
  private readonly ui = createGoalsUi();

  private clampProgress(goal: Goal): number {
    if (goal.required <= 0) {
      return 1;
    }

    return Math.max(0, Math.min(1, goal.current / goal.required));
  }

  private isComplete(goal: Goal): boolean {
    return goal.required <= 0 || goal.current >= goal.required;
  }

  private visibleGoals(): Goal[] {
    const visible: Goal[] = [];

    for (const goal of this.goals) {
      if (goal.claimed !== true) {
        visible.push(goal);
      }
    }

    return visible;
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
    card.rewardButton.SetText("Complete");
    card.rewardButton.SetScript("OnClick", () => this.claimGoal(goal.id));

    if (complete) {
      card.rewardButton.Enable();
      card.progressBar.SetStatusBarColor(0.2, 0.8, 0.35, 1);
    } else {
      card.rewardButton.Disable();
      card.progressBar.SetStatusBarColor(0.18, 0.62, 0.95, 1);
    }
  }

  render(): void {
    this.ui.frame.SetScript("OnEvent", (_self, _event, prefix, message) => {
      if (prefix !== ADDON_PREFIXES.GOALS) {
        return;
      }
      print(message);
    });
    const visible = this.visibleGoals();

    for (const card of this.cards) {
      card.frame.Hide();
    }

    if (visible.length === 0) {
      this.ui.emptyText.Show();
      this.ui.scrollFrame.Hide();
      return;
    }

    this.ui.emptyText.Hide();
    this.ui.scrollFrame.Show();

    for (let i = 0; i < visible.length; i++) {
      this.renderCard(this.getCard(i), visible[i], i);
    }

    const height =
      visible.length * CARD_HEIGHT + Math.max(0, visible.length - 1) * CARD_GAP;
    this.ui.scrollChild.SetHeight(height);
    this.ui.scrollFrame.SetVerticalScroll(0);
  }

  setGoals(nextGoals: Goal[]): void {
    this.goals = nextGoals;
    this.render();
  }

  updateGoal(id: string, current: number, required?: number): void {
    for (const goal of this.goals) {
      if (goal.id === id) {
        goal.current = current;

        if (required !== undefined) {
          goal.required = required;
        }

        this.render();
        return;
      }
    }
  }

  claimGoal(id: string): void {
    for (const goal of this.goals) {
      if (goal.id === id) {
        if (!this.isComplete(goal)) {
          print("Goal incomplete.");
          return;
        }

        goal.claimed = true;
        print(`Reward claimed: ${goal.title}`);
        this.render();
        return;
      }
    }
  }

  show(): void {
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
