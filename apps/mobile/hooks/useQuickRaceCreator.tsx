import { useState } from 'react';
import { supabase } from '~/supabase';
import { useProfileContext } from '~/providers/ProfileProvider';

export function useQuickRaceCreator() {
  const { session, profile } = useProfileContext();
  const [loading, setLoading] = useState(false);

  async function createQuickRace(boats: string[], countdown: number, onSuccess?: (regattaId: number) => void) {
    setLoading(true);

    // IDs for potential cleanup
    let regattaId: number | null = null;
    let raceId: number | null = null;
    let boatIds: number[] = [];
    let timerId: number | null = null;

    try {
      const timestamp = Date.now();
      const username = profile?.username || session?.user?.email?.split('@')[0] || 'anon';
      const regattaName = `QuickRace-${username}-${timestamp}`;

      // 1. Create regatta
      const { data: regatta, error: regattaErr } = await supabase
        .from('regattas')
        .insert([
          { name: regattaName, is_public: false, isQuickRace: true, start_date: new Date().toISOString(), end_date: new Date().toISOString() }
        ])
        .select()
        .single();

      if (regattaErr || !regatta) throw regattaErr || new Error('Failed to create regatta.');
      regattaId = regatta.id;

      // 2. Create race
      const { data: race, error: raceErr } = await supabase
        .from('races')
        .insert([
          { regatta_id: regattaId, race_number: 1 }
        ])
        .select()
        .single();

      if (raceErr || !race) throw raceErr || new Error('Failed to create race.');
      raceId = race.id;

      // 3. Create boats
      const boatRows = boats.map((boat_name) => ({
        regatta_id: regattaId,
        name: boat_name,
      }));

      const { data: boatsData, error: boatsErr } = await supabase
        .from('boats')
        .insert(boatRows)
        .select();

      if (boatsErr) throw boatsErr;
      boatIds = boatsData?.map((b: any) => b.id) || [];

      // 4. Create timer
      const startTime = new Date(Date.now() + (countdown * 60 * 1000)).toISOString();
      const timersToInsert = boatIds.map((boatId) => ({
        race_id: raceId,
        boat_id: boatId,
        start_time: startTime,
      }));
      const { data: timerData, error: timerErr } = await supabase
        .from('timers')
        .insert(timersToInsert)
        .select();

      if (timerErr || !timerData) throw timerErr || new Error('Failed to create timer.');
      // timerId = timerData.id;

      if (onSuccess) onSuccess(regattaId);

      return { regattaId };

    } catch (err: any) {
      // CLEANUP: delete anything that succeeded
      if (timerId) {
        await supabase.from('timers').delete().eq('id', timerId);
      }
      if (boatIds.length > 0) {
        await supabase.from('boats').delete().in('id', boatIds);
      }
      if (raceId) {
        await supabase.from('races').delete().eq('id', raceId);
      }
      if (regattaId) {
        await supabase.from('regattas').delete().eq('id', regattaId);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createQuickRace, loading };
}
