// app/mobile/screens/ExploreScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase';
import { format } from 'date-fns';
import { useThemeStyles } from '../theme/useThemeStyles';
import HeaderBar from '~/HeaderBar';
import VireauLogo from '../../../packages/ui/IconLight.svg';
import { ModalCard } from '~/components/ui/ModalCard';
import QuickRaceContent from '~/screens/QuickRaceScreen';

interface Regatta {
  id: number;
  name: string;
  image: string | null;
  start_date: string;
}

export default function ExploreScreen() {
  const [showQuickRace, setShowQuickRace] = useState(false);
 
  const [regattas, setRegattas] = useState<Regatta[]>([]);
  const [search, setSearch] = useState('');
  const s = useThemeStyles();

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
    <View style={{ flex: 1 }}>
      <HeaderBar title="Explore" />
      {/* Search + Filter Bar */}
      <View style={s.searchContainer}>
        <View style={s.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            style={s.searchInput}
          />
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={s.sectionHeader}>Upcoming Regattas</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={s.listItem}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={s.thumbnail} />
            ) : (
              <VireauLogo width={48} height={48} style={s.thumbnail} />
            )}
            <View>
              <Text style={s.itemTitle}>{item.name}</Text>
              <Text style={s.itemSubtitle}>{format(new Date(item.start_date), 'MMM d, yyyy')}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => setShowQuickRace(true)} style={s.fab}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      {/* Quick‑Race modal ------------------------------------------- */}
      <ModalCard
        visible={showQuickRace}
        onClose={() => setShowQuickRace(false)}>
        <QuickRaceContent />
      </ModalCard>
    </View>
  );
}