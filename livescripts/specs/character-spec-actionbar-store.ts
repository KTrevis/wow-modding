import type { SpecActionBarSlot } from "../../shared/specs/actionbar.types";

export class CharacterSpecActionBarStore {
  static ensureTable(): void {
    QueryCharacters(`
      CREATE TABLE IF NOT EXISTS character_spec_actionbars (
        characterId INT UNSIGNED NOT NULL,
        specId VARCHAR(64) NOT NULL,
        slot SMALLINT UNSIGNED NOT NULL,
        actionType VARCHAR(16) NOT NULL,
        actionId INT UNSIGNED NOT NULL,
        PRIMARY KEY (characterId, specId, slot),
        KEY idx_character_spec_actionbars_spec (characterId, specId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8
    `);
  }

  static save(
    characterId: uint32,
    specId: string,
    slots: SpecActionBarSlot[],
  ): void {
    PrepareCharactersQuery(
      `DELETE FROM character_spec_actionbars WHERE characterId = ? AND specId = ?`,
    )
      .Create()
      .SetUInt32(0, characterId)
      .SetString(1, specId)
      .Send();

    for (const slot of slots) {
      PrepareCharactersQuery(
        `INSERT INTO character_spec_actionbars (characterId, specId, slot, actionType, actionId)
         VALUES (?, ?, ?, ?, ?)`,
      )
        .Create()
        .SetUInt32(0, characterId)
        .SetString(1, specId)
        .SetUInt16(2, slot.slot)
        .SetString(3, slot.actionType)
        .SetUInt32(4, slot.actionId)
        .Send();
    }
  }

  static load(characterId: uint32, specId: string): SpecActionBarSlot[] {
    const result = PrepareCharactersQuery(
      `SELECT slot, actionType, actionId
       FROM character_spec_actionbars
       WHERE characterId = ? AND specId = ?
       ORDER BY slot`,
    )
      .Create()
      .SetUInt32(0, characterId)
      .SetString(1, specId)
      .Send();

    const slots: SpecActionBarSlot[] = [];

    while (result.GetRow()) {
      const slot = {
        slot: result.GetUInt16(0),
        actionType: result.GetString(1) as SpecActionBarSlot["actionType"],
        actionId: result.GetUInt32(2),
      };
      slots.push(slot);
    }

    return slots;
  }
}
