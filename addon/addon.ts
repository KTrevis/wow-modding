import { GoalController } from "./goals/goal-controller";

const goalController = new GoalController();

_G.NikevGoals = {
  Show: () => goalController.show(),
  Hide: () => goalController.hide(),
  Toggle: () => goalController.toggle(),
  Debug: {
    SetGoals: (...args: Parameters<GoalController["setGoals"]>) =>
      goalController.setGoals(...args),
    UpdateGoal: (...args: Parameters<GoalController["updateGoal"]>) =>
      goalController.updateGoal(...args),
    ClaimGoal: (...args: Parameters<GoalController["claimGoal"]>) =>
      goalController.claimGoal(...args),
  },
};

_G.SLASH_NIKEVGOALS1 = "/goals";
_G.SlashCmdList.NIKEVGOALS = () => goalController.toggle();

goalController.render();
