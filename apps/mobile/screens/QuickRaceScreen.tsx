import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { SegmentedToggle } from '~/components/ui/SegmentedToggle';
import { Ionicons } from '@expo/vector-icons';
import { cn } from 'utils/cn';

export function QuickRaceContent() {
  const [boatText, setBoatText] = useState('');
  const [boats, setBoats] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<3 | 4 | 5 | null>(null);

  const ready = countdown && boats.length >= 2;

  return (
    <View className="flex-1 px-6 pt-4">
      {/* Add boat */}
      <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2 mb-4">
        <Ionicons name="add" size={18} color="#6B7280" />
        <TextInput
          placeholder="Add boat by name or number"
          placeholderTextColor="#6B7280"
          value={boatText}
          onChangeText={setBoatText}
          onSubmitEditing={() => {
            if (!boatText.trim()) return;
            setBoats((prev) => [...new Set([...prev, boatText.trim()])]);
            setBoatText('');
          }}
          returnKeyType="done"
          className="flex-1 ml-2 font-medium text-gray-900"
        />
      </View>

      {/* List */}
      <FlatList
        data={boats}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-3">
            <Text className="flex-1 font-medium text-gray-900">{item}</Text>
            <Pressable onPress={() => setBoats((prev) => prev.filter((b) => b !== item))}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 italic mb-4">No boats added yet</Text>
        }
        className="mb-4"
      />

      {/* Countdown */}
      <SegmentedToggle
        segments={[
          { label: '3 min', value: 3 },
          { label: '4 min', value: 4 },
          { label: '5 min', value: 5 },
        ]}
        value={countdown ?? (0 as any)}
        onChange={(v) => setCountdown(v as 3 | 4 | 5)}
        className="mb-6"
      />

      {/* CTA */}
      <Pressable
        disabled={!ready}
        onPress={() => ready && console.log('Start race', { boats, countdown })}
        className={cn(
          'py-4 rounded-xl items-center',
          ready ? 'bg-vireau-orange' : 'bg-vireau-orange/40',
        )}>
        <Text className="text-white font-bold">Start Countdown</Text>
      </Pressable>
    </View>
  );
}

export default function QuickRaceScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <QuickRaceContent />
    </SafeAreaView>
  );
}
