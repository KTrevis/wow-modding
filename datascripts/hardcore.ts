import { std } from "wow/wotlk";
import { MODULE_NAME } from "./utils/constants/module-name.constants";
import { INFINITE_DURATION_ID } from "./utils/constants/duration.constants";

const HARDCORE_AURA = std.Spells.create(MODULE_NAME, "hardcore-aura")
  .Icon.setPath("inv_misc_bone_humanskull_01")
  .Tags.addUnique(MODULE_NAME, "hardcore-aura")
  .Name.enGB.set("Hardcore")
  .AuraDescription.enGB.set("You are in hardcore mode.")
  .Duration.set(INFINITE_DURATION_ID)
  .Effects.addMod((eff) =>
    eff.Type.APPLY_AURA.set()
      .Aura.DUMMY.set()
      .ImplicitTargetA.UNIT_CASTER.set(),
  )
  .Attributes.IS_NEGATIVE.set(true)
  .InlineScripts.OnRemove((eff, application, type) => {
    const player = ToPlayer(application.GetTarget());
    if (!player) {
      return;
    }
    player.ResurrectPlayer(100, false);
    player.AddTimer(1000, 1, 0, () => {
      const GHOST_AURA = 8326;
      player.AddAura(GHOST_AURA, player);
      const HARDCORE_AURA = UTAG("nikev", "hardcore-aura");
      player.AddAura(HARDCORE_AURA, player);
    });
  });

std.InlineScripts.Player.OnLogin((player) =>
  player.AddAura(UTAG("nikev", "hardcore-aura"), player),
);
