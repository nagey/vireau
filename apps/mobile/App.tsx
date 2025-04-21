import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session'
import * as Linking from 'expo-linking';
import { supabase } from './supabase';
import { saveSession, restoreSession, clearSession } from 'supabaseSession';
import HomeScreen from './HomeScreen';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log('🔍 Initial URL:', url); // Log on cold start
    });
  
    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('🔗 Event URL:', url); // Log on resume after redirect
    });
  
    const boot = async () => {
      const session = await restoreSession();
      if (session) {
        setSession(session);
      }
    };
    boot();

    return () => sub.remove();
  }, []);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('in getSession)')
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('in on authchange', session, _event)
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
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
      const params = new URLSearchParams(url.hash.substring(1)); // strip off `#`
  
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
  
      if (access_token && refresh_token) {
        const { data: sessionData, error: setError } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });
        await saveSession(access_token, refresh_token);
  
        if (setError) {
          console.error('Failed to set session:', setError);
        } else {
          console.log('✅ Session set manually:', sessionData);
        }
      } else {
        console.warn('⚠️ No access_token or refresh_token found in redirect URL');
      }
    }
  };
  

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await clearSession();
    setSession(null);

  };

  if (session) {
    return <HomeScreen onLogout={handleLogout} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Vireau</Text>
      <Button title="Login with Google" onPress={handleLogin} />
    </View>
  );
}
