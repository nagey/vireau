import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        {
          type: 'add_columns',
          table: 'regattas',
          columns: [
            { name: 'is_quick_race', type: 'boolean', isOptional: false },
          ],
        },
        {
          // Backfill: set all existing records to false for the new column
          type: 'unsafeSql',
          sql: `UPDATE regattas SET is_quick_race = 0 WHERE is_quick_race IS NULL;`,
        },
      ],
    },
  ],
})
