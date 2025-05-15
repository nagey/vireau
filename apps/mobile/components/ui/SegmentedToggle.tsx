import React from "react";
import { View, Pressable, Text } from "react-native";

export type SegmentedOption = {
  label: string;
  value: string | number;
};

type Props = {
  options: SegmentedOption[];
  selected: string | number;
  onSelect: (val: string | number) => void;
  className?: string;
};

export function SegmentedToggle({
  options,
  selected,
  onSelect,
  className = "",
}: Props) {
  return (
    <View className={`flex-row bg-gray-100 rounded-xl p-1 ${className}`}>
      {options.map((option, idx) => {
        // Use strict equality so '5' !== 5
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`flex-1 py-2 rounded-lg mx-1 ${isSelected ? 'bg-vireau-navy' : 'bg-white'}`}
          >
            <Text className={`text-center font-bold ${isSelected ? 'text-white' : 'text-vireau-navy'}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
