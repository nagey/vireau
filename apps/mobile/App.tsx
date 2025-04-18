import 'react-native-url-polyfill/auto';
import { View, Text, Button } from 'react-native';
import { supabase } from './supabase';

export default function App() {
  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error(error);
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Welcome to Vireau</Text>
      <Button title="Login with Google" onPress={login} />
    </View>
  );
}
