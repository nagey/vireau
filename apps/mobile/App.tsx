// apps/mobile/App.tsx

import 'react-native-url-polyfill/auto';
import { Button, View, Text } from 'react-native';
import { supabase } from './supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const handleLogin = async () => {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'vireau',
      useProxy: true,
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });

    if (error) {
      console.error('OAuth error:', error.message);
    } else if (data?.url) {
      // Open the Supabase auth URL in the browser
      const result = await AuthSession.startAsync({ authUrl: data.url });
      console.log('OAuth result:', result);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Vireau</Text>
      <Button title="Login with Google" onPress={handleLogin} />
    </View>
  );
}
