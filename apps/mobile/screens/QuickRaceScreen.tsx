import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SegmentedToggle } from '~/components/ui/SegmentedToggle';
import { cn } from '~/utils/cn';

export default function QuickRaceScreen() {
  const [boatText, setBoatText] = useState('');
  const [boats, setBoats] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<3 | 4 | 5 | null>(null);

  const ready = (countdown && boats.length >= 2);

  return (
    <View style={styles.card}>
    {/* grab handle */}
    <View style={styles.handleContainer}>
      <View style={styles.handle} />
    </View>  
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        {/* Heading */}
        <Text className="text-xl font-semibold text-vireau-navy mb-5">
          Quick Race
        </Text>
        {/* Input pill */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-5">
          <Ionicons name="add" size={18} color="#6B7280" />
          <TextInput
            placeholder="Add boat by name or number"
            placeholderTextColor="#6B7280"
            value={boatText}
            onChangeText={setBoatText}
            onSubmitEditing={() => {
              const trimmed = boatText.trim();
              if (!trimmed) return;
              setBoats((prev) => [...new Set([...prev, trimmed])]);
              setBoatText('');
            }}
            className="flex-1 ml-3 font-medium text-gray-900 text-base"
            returnKeyType="done"
          />
        </View>

        {/* Boat list */}
        <FlatList
          data={boats}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
          renderItem={({ item }) => (
            <View className="flex-row items-center py-3">
              <Text className="flex-1 text-base text-gray-900">{item}</Text>
              <Pressable
                onPress={() =>
                  setBoats((prev) => prev.filter((b) => b !== item))
                }>
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-gray-500 italic mb-4">
              No boats added yet
            </Text>
          }
          className="mb-6"
        />

        {/* Countdown selector */}
        <SegmentedToggle
          options={[
            { label: '3 min', value: 3 },
            { label: '4 min', value: 4 },
            { label: '5 min', value: 5 },
          ]}
          selected={countdown ?? (0 as any)}
          onSelect={(v) => setCountdown(v as 3 | 4 | 5)}
          className="mb-8"
        />

        {/* CTA */}
        <Pressable
          disabled={!ready}
          className={cn(
            'py-4 rounded-xl items-center',
            ready ? 'bg-vireau-orange shadow' : 'bg-vireau-orange/40',
          )}
          onPress={() => ready && console.log('Start race', { boats, countdown })}
        >
          <Text className="text-white font-semibold text-base">
            Start Countdown
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'flex-end' },
  card: {
    width: '100%',
    height: '93%',            // sits just under the Dynamic Island
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
});
