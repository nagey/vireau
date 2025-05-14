// app/mobile/App.tsx
import "./global.css"
import React, { useState } from 'react';
import { View } from 'react-native';
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
  const [splashFinished, setSplashFinished] = useState(false);
  const [loginScreenReady, setLoginScreenReady] = useState(false);

  const handleSplashFinish = () => {
    setSplashFinished(true);
  };

  const handleLoginScreenReady = () => {
    setLoginScreenReady(true);
  };

  const showSplash = !splashFinished;
  const startSplashFade = loginScreenReady && !splashFinished && !loading;

  return (
    <View style={{ flex: 1 }}>
      {session ? (
        <AppNavigator />
      ) : (
        <LoginScreen login={login} onReady={handleLoginScreenReady} />
      )}

      {showSplash && (
        <SplashScreen
          onFinish={handleSplashFinish}
          startFade={startSplashFade}
        />
      )}
    </View>
  );
}
