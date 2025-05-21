// app/providers/DatabaseProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { database } from '~/database';

export const DatabaseContext = createContext(database);

export const useDatabase = () => useContext(DatabaseContext);

// Provider component
export const DatabaseProvider = ({ children }: { children: ReactNode }) => (
  <DatabaseContext.Provider value={database}>
    {children}
  </DatabaseContext.Provider>
);
