export type GoalCard = {
  frame: WoWAPI.Frame;
  title: WoWAPI.FontString;
  description: WoWAPI.FontString;
  progressLabel: WoWAPI.FontString;
  progressBar: WoWAPI.StatusBar;
  progressText: WoWAPI.FontString;
  rewardButton: WoWAPI.Button;
};

export type CategoryButton = {
  frame: WoWAPI.Button;
  label: WoWAPI.FontString;
  summary: WoWAPI.FontString;
};

export type GoalsUi = {
  frame: WoWAPI.Frame;
  header: WoWAPI.FontString;
  backButton: WoWAPI.Button;
  emptyText: WoWAPI.FontString;
  scrollFrame: WoWAPI.ScrollFrame;
  scrollChild: WoWAPI.Frame;
};
