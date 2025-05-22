// app/mobile/components/HeaderBar.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useThemeStyles } from '~/theme/useThemeStyles';
import { useProfileContext } from '~/providers/ProfileProvider';
import DefaultAvatarIcon from '~/assets/default-profile.svg'; 

interface HeaderBarProps {
  title: string;
}

export default function HeaderBar({ title }: HeaderBarProps) {
  const s = useThemeStyles();
  const { avatarUrl, logout } = useProfileContext();

  return (
    <View style={s.header} className="bg-vireau-navy">
      <Text style={s.headerText}>{title}</Text>
      {avatarUrl ? (
        <TouchableOpacity onPress={logout}>
          <Image source={{ uri: avatarUrl }} style={s.avatar} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={logout}>
          <View style={[s.avatar, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
            <DefaultAvatarIcon width={24} height={24} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
