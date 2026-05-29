import { UTAGS } from "../utags";

const AURAS_TO_REMOVE_ON_LOGOUT = [UTAGS.PERCENT_XP_BUFF_10];

export function removeAurasOnLogout(events: TSEvents) {
  events.Player.OnLogout((player) => {
    for (const id of AURAS_TO_REMOVE_ON_LOGOUT) {
      player.RemoveAura(id);
    }
  });
}
