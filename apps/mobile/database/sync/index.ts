import { synchronize } from '@nozbe/watermelondb/sync'
import { pullRegattas, pushRegattas } from './regattaSync'

export async function synchronizeDatabase(database, supabase, userId) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      return await pullRegattas({ lastPulledAt, supabase, userId })
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      await pushRegattas({ changes, supabase, userId })
    },
    log: true,
  })
}
