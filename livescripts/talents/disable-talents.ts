function clearTalentPoints(player: TSPlayer): void {
  if (player.GetFreeTalentPoints() > 0) {
    player.SetFreeTalentPoints(0);
  }
}

export function disableTalents(events: TSEvents): void {
  events.Player.OnLogin((player) => {
    player.AddNamedTimer("disable-talents-login", 100, 1, 0, () => {
      player.ResetTalents(true);
      clearTalentPoints(player);
    });
  });

  events.Player.OnCalcTalentPoints((_player, talents) => {
    talents.set(0);
  });

  events.Player.OnFreeTalentPointsChanged((player) => {
    clearTalentPoints(player);
  });

  events.Player.OnLearnTalent((_player, _tabId, _talentId, _talentRank, _spellId, cancel) => {
    cancel.set(true);
  });
}
