// app/providers/DatabaseProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { database } from '~/database';
import { useDatabaseSync } from '~/hooks/useDatabaseSync'
import { useProfileContext } from './ProfileProvider';
import { supabase } from '~/supabase';

export const DatabaseContext = createContext(database);

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfileContext()
  useDatabaseSync({
    database,
    supabase,
    userId: profile?.id
  })
  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  )
}