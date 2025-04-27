// app/mobile/providers/ProfileProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '~/supabase';
import { 
  saveSession, 
  restoreSession, 
  clearSession, 
  saveAvatarUrl, 
  restoreAvatarUrl, 
  clearAvatarUrl 
} from '~/supabaseSession';

WebBrowser.maybeCompleteAuthSession();

interface ProfileContextProps {
  session: any;
  avatarUrl: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps>({
  session: null,
  avatarUrl: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const restoredSession = await restoreSession();
        if (restoredSession) {
          setSession(restoredSession);
        }

        const cachedAvatar = await restoreAvatarUrl();
        if (cachedAvatar) {
          setAvatarUrl(cachedAvatar);
        }
      } catch (error) {
        console.error('Error restoring session or avatar:', error);
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession) {
          setSession(newSession);
        }
      });

      setAuthLoading(false);

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!session) {
          setAvatarUrl(null);
          setProfileLoading(false);
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching user profile:', error);
          setAvatarUrl(null);
          setProfileLoading(false);
          return;
        }

        if (user?.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
          await saveAvatarUrl(user.user_metadata.avatar_url);
        } else {
          setAvatarUrl(null);
          await clearAvatarUrl();
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        setAvatarUrl(null);
        await clearAvatarUrl();
      } finally {
        setProfileLoading(false); // Always clear loading
      }
    };

    fetchProfile();
  }, [session]);

  const login = async (provider: 'google' | 'apple') => {
    setAuthLoading(true);

    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: false,
        scheme: 'vireau',
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectUri },
      });

      if (error) {
        console.error('OAuth error:', error);
        setAuthLoading(false);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

      if (result.type !== 'success' || !result.url) {
        console.error('Login cancelled or failed');
        setAuthLoading(false);
        return;
      }

      // ✅ Parse returned URL for tokens manually
      const parsedUrl = new URL(result.url);
      const params = new URLSearchParams(parsedUrl.hash.substring(1));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        console.log('✅ Parsed tokens from URL, restoring session...');
        const { data: sessionData, error: setError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (setError) {
          console.error('Failed to set session:', setError);
        } else {
          console.log('✅ Session restored manually:', sessionData);
          setSession(sessionData.session);
          await saveSession(access_token, refresh_token);
        }
      } else {
        console.error('❌ No access_token/refresh_token found in URL');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await clearSession();
      await clearAvatarUrl();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setSession(null);
      setAvatarUrl(null);
    }
  };

  const loading = authLoading || profileLoading;

  return (
    <ProfileContext.Provider value={{ session, avatarUrl, loading, login, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
