import { ADDON_PREFIXES } from "../shared/prefix";

export function Main(events: TSEvents) {
  events.Player.OnSay((player) => {
    const object = new TSJsonObject();
    object.SetString("type", "test");
    player.SendAddonMessage(ADDON_PREFIXES.GOALS, object.toString(), 0, player);
  });
}
