// app/mobile/hooks/useProfile.ts

import { useEffect, useState } from 'react';
import { supabase } from '~/supabase';

export function useProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata && user.user_metadata.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    };

    fetchProfile();
  }, []);

  return { avatarUrl };
}
