import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from './supabase';
import { useThemeStyles } from './theme/useThemeStyles';
import HomeScreen from './HomeScreen';
import SplashScreen from './SplashScreen';
import { saveSession, restoreSession, clearSession } from './supabaseSession';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const styles = useThemeStyles();


  useEffect(() => {
    const initializeAuth = async () => {
      // Try restoring session from SecureStore
      const restoredSession = await restoreSession();
      if (restoredSession) {
        setSession(restoredSession);
      }

      // Listen for live auth state changes (optional)
      const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (event !== 'INITIAL_SESSION') {
          setSession(newSession);
        }
      });

      setIsLoading(false);

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const handleLogin = async () => {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'vireau',
      path: 'auth/callback',
      useProxy: false
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUri }
    });

    if (error) {
      console.error('OAuth error:', error);
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.substring(1));

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        const { data: sessionData, error: setError } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (setError) {
          console.error('Failed to set session:', setError);
        } else {
          console.log('✅ Session set manually:', sessionData);
          setSession(sessionData.session);
          await saveSession(access_token, refresh_token);
        }
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await clearSession();
    setSession(null);
  };

  return (
    <View style={styles.container}>
      {session ? (
        <HomeScreen onLogout={handleLogout} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Welcome to Vireau</Text>
          <Button title="Login with Google" onPress={handleLogin} />
        </View>
      )}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </View>
  );
}
