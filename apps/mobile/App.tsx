// apps/mobile/App.tsx
import 'react-native-url-polyfill/auto';

import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // required for Expo Go
  });

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });
    if (error) console.error('OAuth error:', error);
    else console.log('Redirecting to:', data.url);
  };

  return (
    <View style={{ marginTop: 100, alignItems: 'center' }}>
      <Text>Welcome to Vireau</Text>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
}
