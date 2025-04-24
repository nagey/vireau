import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase';
import { useThemeStyles } from '../theme/useThemeStyles';

export default function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const styles = useThemeStyles();
  const [regattas, setRegattas] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRegattas = async () => {
    const { data, error } = await supabase
      .from('regattas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading regattas:', error);
    } else {
      setRegattas(data);
    }
  };

  const addRegatta = async () => {
    if (!newName.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('regattas').insert({ name: newName });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setNewName('');
      fetchRegattas();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegattas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Regattas</Text>

      <FlatList
        data={regattas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.text, { marginBottom: 8 }]}>• {item.name}</Text>
        )}
        ListEmptyComponent={<Text style={styles.text}>No regattas yet.</Text>}
        contentContainerStyle={{ marginVertical: 20 }}
      />

      <TextInput
        placeholder="New regatta name"
        value={newName}
        onChangeText={setNewName}
        placeholderTextColor={styles.colors.border}
        style={[styles.text, {
          borderWidth: 1,
          borderColor: styles.colors.border,
          padding: 10,
          marginBottom: 12,
          borderRadius: 6,
        }]}
      />

      <View style={{ marginBottom: 20 }}>
        <Button title="Add Regatta" onPress={addRegatta} disabled={loading} />
      </View>

      <Button title="Log out" onPress={onLogout} />
    </View>
  );
}
