import { useEffect, useState, useCallback } from 'react'
import { synchronizeDatabase } from '~/database/sync' // adjust path

export function useDatabaseSync({ database, supabase, userId, auto = true }) {
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)

  const sync = useCallback(async () => {
    setSyncing(true)
    setError(null)
    try {
      await synchronizeDatabase(database, supabase, userId)
    } catch (err) {
      setError(err)
    } finally {
      setSyncing(false)
    }
  }, [database, supabase, userId])

  useEffect(() => {
    if (auto && database && supabase && userId) {
      sync()
    }
    // Only re-run if database, supabase, or userId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [database, supabase, userId, auto])

  return { sync, syncing, error }
}
