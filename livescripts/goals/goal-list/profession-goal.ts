import { ServerGoal } from "./goal-list";

const PROFESSIONS = {
  FIRST_AID: 129,
  BLACKSMITHING: 164,
  LEATHERWORKING: 165,
  ALCHEMY: 171,
  HERBALISM: 182,
  COOKING: 185,
  MINING: 186,
  TAILORING: 197,
  ENGINEERING: 202,
  ENCHANTING: 333,
  FISHING: 356,
  SKINNING: 393,
  JEWELCRAFTING: 755,
  INSCRIPTION: 773,
};

type ProfessionKey = keyof typeof PROFESSIONS;

function createProfessionGoal(key: ProfessionKey, level: number): ServerGoal {
  const professionId = PROFESSIONS[key];

  return {
    id: `profession-${key}`,
    category: "Professions",
    title: `Reach level ${level} in ${key}`,
    description: `Reward : Every character on your account will start at level ${level} in ${key}.`,
    current: (player: TSPlayer) => player.GetSkillValue(professionId),
    required: level,
    isCompleted: (player) => player.GetSkillValue(professionId) >= level,
    reward: (player) => {},
  };
}

export function createGoalForEveryProfession(level: uint16) {
  const keys = Object.keys(PROFESSIONS) as ProfessionKey[];
  const goals: ServerGoal[] = [];

  for (const key of keys) {
    goals.push(createProfessionGoal(key, level));
  }
  return goals;
}
