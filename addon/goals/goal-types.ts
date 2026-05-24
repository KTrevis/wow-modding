export type GoalCard = {
  frame: WoWAPI.Frame;
  title: WoWAPI.FontString;
  description: WoWAPI.FontString;
  progressLabel: WoWAPI.FontString;
  progressBar: WoWAPI.StatusBar;
  progressText: WoWAPI.FontString;
  rewardButton: WoWAPI.Button;
};

export type GoalsUi = {
  frame: WoWAPI.Frame;
  emptyText: WoWAPI.FontString;
  scrollFrame: WoWAPI.ScrollFrame;
  scrollChild: WoWAPI.Frame;
};
