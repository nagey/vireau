import { useEffect, useState } from 'react';
import { useDatabase } from '~/providers/DatabaseProvider';
import { Q } from '@nozbe/watermelondb';

export function useRegattas() {
  const database = useDatabase();
  const [regattas, setRegattas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const regattasCollection = database.get('regattas');
    // Observe for real-time updates
    const subscription = regattasCollection
      .query(Q.sortBy('start_date', Q.desc))
      .observe()
      .subscribe((results) => {
        setRegattas(results);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [database]);

  return { regattas, loading };
}
