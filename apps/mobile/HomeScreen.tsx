import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { supabase } from './supabase';
import { useEffect, useState } from 'react';

export default function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        setUser(user);
      }
    };
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      {user?.user_metadata?.avatar_url && (
        <Image
          source={{ uri: user.user_metadata.avatar_url }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.title}>Vireau Home</Text>
      <Button title="Log out" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
