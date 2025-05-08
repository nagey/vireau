import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { cn } from 'utils/cn';

export interface Segment<T extends string | number> {
  label: string;
  value: T;
}

interface SegmentedToggleProps<T extends string | number> {
  segments: Segment<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}

export function SegmentedToggle<T extends string | number>({
  segments,
  value,
  onChange,
  className,
}: SegmentedToggleProps<T>) {
  return (
    <View className={cn('flex-row bg-gray-100 rounded-xl overflow-hidden', className)}>
      {segments.map(({ label, value: v }, idx) => {
        const selected = v === value;
        return (
          <Pressable
            key={idx}
            className={cn(
              'flex-1 py-3 items-center',
              selected && 'bg-vireau-navy',
            )}
            onPress={() => onChange(v)}>
            <Text className={cn('font-semibold text-gray-900', selected && 'text-white')}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
