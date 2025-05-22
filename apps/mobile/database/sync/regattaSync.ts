// regattaSync.ts
export async function pullRegattas({ lastPulledAt, supabase, userId }) {
  // Convert WatermelonDB's `lastPulledAt` (number/ms) to ISO string for SQL
  const since = new Date(lastPulledAt || 0).toISOString()

  // Call the stored procedure
  const { data, error } = await supabase
    .rpc('sync_regattas', { since, user_id: userId })

  if (error) throw error

  // WatermelonDB expects: { changes: { regattas: { created: [], updated: [], deleted: [] } }, timestamp }
  // You may want to split changed into created/updated, but for most purposes, treat them both as updated
  const changes = {
    regattas: {
      created: [], // optionally separate if you want more granularity
      updated: data.regattas || [],
      deleted: data.deleted || [],
    }
  }

  // Return changes and a new timestamp for next sync
  return {
    changes,
    timestamp: Date.now(),
  }
}
// regattaSync.ts
export async function pushRegattas({ changes, supabase, userId }) {
  // WatermelonDB provides changes as { regattas: { created, updated, deleted } }
  const { created = [], updated = [], deleted = [] } = changes.regattas || {}

  // Push local changes to Supabase
  const { error } = await supabase.rpc('push_regatta_changes', {
    created,
    updated,
    deleted_ids: deleted,
    user_id: userId,
  })
  if (error) throw error
}
