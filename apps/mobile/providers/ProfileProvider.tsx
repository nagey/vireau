// app/mobile/providers/ProfileProvider.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as AppleAuthentication from 'expo-apple-authentication';
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
  profile: any;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps>({
  session: null,
  profile: null,
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
  
        if (restoredSession?.access_token && restoredSession?.refresh_token) {
          console.log('✅ Found saved tokens, restoring session...');
  
          const { data, error } = await supabase.auth.setSession({
            access_token: restoredSession.access_token,
            refresh_token: restoredSession.refresh_token,
          });
  
          if (error) {
            console.error('❌ Failed to restore session:', error);
            console.log('🧹 Clearing invalid saved tokens...');
            await clearSession(); // 🧹 Clear invalid tokens immediately
          } else if (data.session) {
            console.log('✅ Session restored successfully:', data.session);
            setSession(data.session);
          } else {
            console.warn('⚠️ No session found after setting tokens.');
            await clearSession(); // 🧹 Clear invalid tokens just in case
          }
        } else {
          console.warn('⚠️ No saved tokens found.');
        }
  
        const cachedAvatar = await restoreAvatarUrl();
        if (cachedAvatar) {
          setAvatarUrl(cachedAvatar);
        }
  
      } catch (error) {
        console.error('Error restoring session or avatar:', error);
        console.log('🧹 Clearing invalid saved tokens (exception case)...');
        await clearSession();
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
  
      if (provider === 'apple' && Platform.OS === 'ios') {
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        const isRealDevice = Device.isDevice;
  
        if (isAvailable && isRealDevice) {
          console.log('✅ Using native Apple Sign-In flow.');
  
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
  
          console.log('✅ Apple credential received:', credential);
  
          if (credential.identityToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'apple',
              token: credential.identityToken,
            });
  
            if (error) {
              console.error('Supabase Apple signInWithIdToken error:', error);
            } else {
              console.log('✅ Supabase session created:', data.session);
              setSession(data.session);
              await saveSession(
                data.session.access_token,
                data.session.refresh_token
              );
            }
          } else {
            console.error('❌ No identity token returned from Apple.');
          }
  
          return; // Native Apple login finished — exit login function
  
        } else {
          console.log('⚠️ Running on Simulator or AppleAuth unavailable — falling back to Web OAuth.');
        }
      }
  
      // Web OAuth fallback (Google or Apple)
      console.log('🌐 Using Web OAuth flow.');
  
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUri,
          scopes: provider === 'apple' ? 'name email' : undefined,
        },
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
  
      console.log('✅ OAuth flow completed, parsing tokens from URL...');
  
      const url = new URL(result.url);
      const fragment = url.hash.substring(1);
      const params = new URLSearchParams(fragment);
  
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
  
      if (access_token && refresh_token) {
        console.log('✅ Parsed tokens, setting session manually.');
  
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
  
        if (sessionError) {
          console.error('Error setting session manually:', sessionError);
        } else {
          console.log('✅ Session set successfully:', sessionData.session);
          setSession(sessionData.session);
          await saveSession(access_token, refresh_token);
        }
      } else {
        console.error('❌ Missing access_token or refresh_token in URL fragment.');
      }
  
    } catch (err) {
      console.error('Unexpected login error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    console.log('🔒 Logging out...');
  
    try {
      await supabase.auth.signOut();  // ✅ always try signOut first
    } catch (err) {
      console.error('Error signing out from Supabase:', err);
    }
  
    try {
      await clearSession(); // ✅ then clear local saved tokens
      await clearAvatarUrl();
    } catch (err) {
      console.error('Error clearing session or avatar:', err);
    } finally {
      setSession(null);
      setAvatarUrl(null);
    }
  };
  

  const loading = authLoading || profileLoading;

  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (session) {
      console.log('✅ Session detected — starting automatic refresh timer.');
  
      // Clear any existing timer
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
  
      refreshTimer.current = setInterval(async () => {
        try {
          console.log('🔄 Attempting to refresh session...');
          const { data, error } = await supabase.auth.refreshSession();
  
          if (error) {
            console.error('⚠️ Session refresh failed:', error);
            // Optionally auto-logout if refresh fails
            await logout();
          } else if (data.session) {
            console.log('✅ Session refreshed successfully.');
            setSession(data.session);
  
            // Optional: save refreshed tokens
            await saveSession(data.session.access_token, data.session.refresh_token);
          }
        } catch (err) {
          console.error('Unexpected error refreshing session:', err);
        }
      }, 10 * 60 * 1000); // ✅ Every 10 minutes
  
    } else {
      console.log('ℹ️ No session — stopping refresh timer.');
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
        refreshTimer.current = null;
      }
    }
  
    // Clear timer on unmount
    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, [session]);
  
  const profile = session?.user;
  return (
    <ProfileContext.Provider value={{ session, profile, avatarUrl, loading, login, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
