import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { supabase } from './supabase';
import { useEffect, useState } from 'react';
import { useThemeStyles } from './theme/useThemeStyles';

export default function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<any>(null);
  const styles = useThemeStyles();
console.log(styles)
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
          style={localStyles.avatar}
        />
      )}
      <Text style={styles.title}>Vireau Home</Text>
      <Button title="Log out" onPress={onLogout} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    top: 45,
    left: 20,
  },
});
