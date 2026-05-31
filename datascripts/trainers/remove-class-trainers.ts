import { std } from "wow/wotlk";
import { NPCFlags } from "wow/wotlk/std/Creature/NPCFlags";

const CLASS_TRAINER_TYPE = 0;

const classTrainerIds = new Set(
  std.SQL.trainer
    .queryAll({ Type: CLASS_TRAINER_TYPE })
    .map((trainer) => trainer.Id.get()),
);

const classTrainerCreatures = std.SQL.creature_default_trainer
  .queryAll({})
  .filter((trainer) => classTrainerIds.has(trainer.TrainerId.get()));

for (const trainer of classTrainerCreatures) {
  std.CreatureTemplates.load(trainer.CreatureId.get()).NPCFlags.remove([
    NPCFlags.TRAINER,
    NPCFlags.CLASS_TRAINER,
  ]);
}
