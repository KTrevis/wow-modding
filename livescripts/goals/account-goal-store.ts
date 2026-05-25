export type AccountGoalRecord = {
  goal: string;
  completed: boolean;
  claimed: boolean;
};

export class AccountGoalStore {
  static ensureTable(): void {
    QueryCharacters(`
        CREATE TABLE IF NOT EXISTS account_goals (
          accountId INT UNSIGNED NOT NULL,
          goal VARCHAR(64) NOT NULL,
          claimedAt INT UNSIGNED NULL DEFAULT NULL,
          PRIMARY KEY (accountId, goal),
          KEY idx_account_goals_goal (goal)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8
      `);
  }

  static add(accountId: uint32, goal: string): void {
    PrepareCharactersQuery(
      `INSERT IGNORE INTO account_goals (accountId, goal) VALUES (?, ?)`,
    )
      .Create()
      .SetUInt32(0, accountId)
      .SetString(1, goal)
      .Send();
  }

  static claim(accountId: uint32, goal: string): void {
    PrepareCharactersQuery(
      `INSERT INTO account_goals (accountId, goal, claimedAt)
       VALUES (?, ?, UNIX_TIMESTAMP())
       ON DUPLICATE KEY UPDATE
         claimedAt = COALESCE(claimedAt, UNIX_TIMESTAMP())`,
    )
      .Create()
      .SetUInt32(0, accountId)
      .SetString(1, goal)
      .Send();
  }

  static isClaimed(accountId: uint32, goal: string): boolean {
    const result = PrepareCharactersQuery(
      `SELECT 1 FROM account_goals
       WHERE accountId = ? AND goal = ? AND claimedAt IS NOT NULL
       LIMIT 1`,
    )
      .Create()
      .SetUInt32(0, accountId)
      .SetString(1, goal)
      .Send();

    return result.GetRow();
  }

  static list(accountId: uint32): AccountGoalRecord[] {
    const result = PrepareCharactersQuery(
      `SELECT goal, claimedAt IS NOT NULL
       FROM account_goals
       WHERE accountId = ?
       ORDER BY goal`,
    )
      .Create()
      .SetUInt32(0, accountId)
      .Send();

    const records: AccountGoalRecord[] = [];

    while (result.GetRow()) {
      records.push({
        goal: result.GetString(0),
        completed: result.GetUInt8(1) !== 0,
        claimed: result.GetUInt8(1) !== 0,
      });
    }

    return records;
  }
}
