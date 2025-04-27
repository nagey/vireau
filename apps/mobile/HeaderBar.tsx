// app/mobile/components/HeaderBar.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useThemeStyles } from '~/theme/useThemeStyles';
import { useProfileContext } from '~/providers/ProfileProvider';

interface HeaderBarProps {
  title: string;
}

export default function HeaderBar({ title }: HeaderBarProps) {
  const s = useThemeStyles();
  const { avatarUrl } = useProfileContext();

  return (
    <View style={s.header}>
      <Text style={s.headerText}>{title}</Text>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={s.avatar} />
      ) : (
        <View style={[s.avatar, { backgroundColor: '#ccc' }]} />
      )}
    </View>
  );
}