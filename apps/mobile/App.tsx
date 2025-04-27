// app/mobile/App.tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useThemeStyles } from './theme/useThemeStyles';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import AppNavigator from './navigation/AppNavigator';
import { ProfileProvider, useProfileContext } from './providers/ProfileProvider';

export default function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}

function AppContent() {
  const styles = useThemeStyles();
  const { session, loading, login } = useProfileContext();
  const [splashVisible, setSplashVisible] = useState(true);

  const handleSplashFinish = () => {
    setSplashVisible(false);
  };

  console.log(loading, splashVisible, session)
  if (loading || splashVisible) {
    return (
      <View style={styles.appHome}>
        <SplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }
  if (!session) {
    return (
      <LoginScreen login={login} />
    );
  }

  return (
    <View style={styles.appHome}>
      <AppNavigator />
    </View>
  );
}
