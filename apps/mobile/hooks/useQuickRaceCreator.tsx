// apps/mobile/hooks/useQuickRaceCreator.tsx
import { useState } from 'react';
import { useDatabase } from '~/providers/DatabaseProvider'; // <-- Use the hook you created
import { useProfileContext } from '~/providers/ProfileProvider';
import uuid from 'react-native-uuid';

const uuidv4 = uuid.v4;

export function useQuickRaceCreator() {
  const database = useDatabase(); // Get WatermelonDB instance from context
  const { session, profile } = useProfileContext();
  const [loading, setLoading] = useState(false);

  async function createQuickRace(boats: string[], countdown: number, onSuccess?: (regattaId: string) => void) {
    setLoading(true);

    let regattaId: string | null = null;
    let raceId: string | null = null;
    let boatIds: string[] = [];
    let timerIds: string[] = [];

    try {
      const timestamp = Date.now();
      const username = profile?.username || session?.user?.email?.split('@')[0] || 'anon';
      const regattaName = `QuickRace-${username}-${timestamp}`;

      const regattasCollection = database.get('regattas');
      const racesCollection = database.get('races');
      const boatsCollection = database.get('boats');
      const timersCollection = database.get('timers');

      // 1. Create regatta
      regattaId = uuidv4();
      await database.write(async () => {
        await regattasCollection.create(r => {
          r._raw.id = regattaId!;
          r.name = regattaName;
          r.public = false;
          r.isQuickRace = true;
          r.start_date = timestamp;
          r.end_date = timestamp;
          r.created_at = timestamp;
          r.updated_at = timestamp;
        });
      });

      // 2. Create race
      raceId = uuidv4();
      await database.write(async () => {
        await racesCollection.create(r => {
          r._raw.id = raceId!;
          r.regatta_id = regattaId!;
          r.number = 1;
          r.created_at = timestamp;
          r.updated_at = timestamp;
        });
      });

      // 3. Create boats
      for (const boat_name of boats) {
        const boatId = uuidv4();
        boatIds.push(boatId);
        await database.write(async () => {
          await boatsCollection.create(b => {
            b._raw.id = boatId;
            b.regatta_id = regattaId!;
            b.name = boat_name;
            b.created_at = timestamp;
            b.updated_at = timestamp;
          });
        });
      }

      // 4. Create timers
      const startTime = timestamp + countdown * 60 * 1000;
      for (const boatId of boatIds) {
        const timerId = uuidv4();
        timerIds.push(timerId);
        await database.write(async () => {
          await timersCollection.create(t => {
            t._raw.id = timerId;
            t.race_id = raceId!;
            t.boat_id = boatId;
            t.time = startTime;
            t.created_at = timestamp;
            t.updated_at = timestamp;
          });
        });
      }

      if (onSuccess) onSuccess(regattaId);

      return { regattaId };

    } catch (err: any) {
      // CLEANUP: delete anything that succeeded
      await database.write(async () => {
        for (const timerId of timerIds) {
          const timer = await database.get('timers').find(timerId).catch(() => null);
          if (timer) await timer.destroyPermanently();
        }
        for (const boatId of boatIds) {
          const boat = await database.get('boats').find(boatId).catch(() => null);
          if (boat) await boat.destroyPermanently();
        }
        if (raceId) {
          const race = await database.get('races').find(raceId).catch(() => null);
          if (race) await race.destroyPermanently();
        }
        if (regattaId) {
          const regatta = await database.get('regattas').find(regattaId).catch(() => null);
          if (regatta) await regatta.destroyPermanently();
        }
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createQuickRace, loading };
}
