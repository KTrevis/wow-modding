import { GoalController } from "./goals/goal-controller";
import { SpecController } from "./specs/spec-controller";

const goalController = new GoalController();
const specController = new SpecController();

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

_G.NikevSpecs = {
  Show: () => specController.show(),
  Hide: () => specController.hide(),
  Toggle: () => specController.toggle(),
  Debug: {
    GetSpecs: () => specController.getSpecs(),
  },
};

_G.SLASH_NIKEVGOALS1 = "/goals";
_G.SlashCmdList.NIKEVGOALS = () => goalController.toggle();

_G.SLASH_NIKEVSPECS1 = "/specs";
_G.SlashCmdList.NIKEVSPECS = () => specController.toggle();

goalController.render();
