// app/mobile/providers/ProfileProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '~/supabase';

interface ProfileContextProps {
  avatarUrl: string | null;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextProps>({
  avatarUrl: null,
  loading: true,
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata && user.user_metadata.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ avatarUrl, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
