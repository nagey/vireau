// app/mobile/screens/ExploreScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Regatta {
  id: number;
  name: string;
  image: string;
  start_date: string;
}

export default function ExploreScreen() {
  const [regattas, setRegattas] = useState<Regatta[]>([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRegattas = async () => {
      const { data, error } = await supabase
        .from('regattas')
        .select('*')
        .order('start_date');

      if (!error) setRegattas(data);
    };

    fetchRegattas();
  }, []);

  const filtered = regattas.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      <View className="bg-[#0D3B66] px-4 pt-14 pb-3">
        <Text className="text-white text-2xl font-bold mb-3">Explore</Text>
        <View className="flex-row items-center bg-white rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-2"
          />
          <Ionicons name="filter" size={20} color="#999" />
        </View>
      </View>

      <Text className="text-lg font-semibold px-4 mt-4">Upcoming Regattas</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center px-4 py-3">
            <Image source={{ uri: item.image }} className="w-12 h-12 rounded-lg mr-3" />
            <View>
              <Text className="text-base font-medium">{item.name}</Text>
              <Text className="text-sm text-gray-500">{format(new Date(item.start_date), 'MMM d, yyyy')}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity className="absolute bottom-6 right-6 bg-orange-500 rounded-full p-4 shadow-lg">
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
