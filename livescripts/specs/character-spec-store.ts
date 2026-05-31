export class CharacterSpecStore {
  static ensureTable(): void {
    QueryCharacters(`
      CREATE TABLE IF NOT EXISTS character_specs (
        characterId INT UNSIGNED NOT NULL,
        specId VARCHAR(64) NOT NULL,
        PRIMARY KEY (characterId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8
    `);
  }

  static save(characterId: uint32, specId: string): void {
    PrepareCharactersQuery(
      `INSERT INTO character_specs (characterId, specId)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE specId = VALUES(specId)`,
    )
      .Create()
      .SetUInt32(0, characterId)
      .SetString(1, specId)
      .Send();
  }

  static get(characterId: uint32): string | undefined {
    const result = PrepareCharactersQuery(
      `SELECT specId FROM character_specs WHERE characterId = ? LIMIT 1`,
    )
      .Create()
      .SetUInt32(0, characterId)
      .Send();

    if (!result.GetRow()) {
      return undefined;
    }

    return result.GetString(0);
  }
}
