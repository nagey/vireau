// app/mobile/screens/SplashScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { useColorScheme, StyleSheet, Animated } from 'react-native';
import { useThemeStyles } from '~/theme/useThemeStyles';
import VireauLogoLight from 'ui/LogoLight.svg';
import VireauLogoDark from 'ui/LogoDark.svg';

interface SplashScreenProps {
  onFinish: () => void;
  minimumVisibleMs?: number;
}

export default function SplashScreen({ onFinish, minimumVisibleMs = 1000 }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const styles = { ...useThemeStyles(), ...localStyles };
  const [minimumElapsed, setMinimumElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumElapsed(true);
    }, minimumVisibleMs);

    return () => clearTimeout(timer);
  }, [minimumVisibleMs]);

  useEffect(() => {
    if (minimumElapsed) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }
  }, [minimumElapsed, opacity, onFinish]);

  return (
    <Animated.View style={[styles.container, styles.darkMode, { opacity }]}>
      {styles.isDark ? (
        <VireauLogoDark width={180} height={180} />
      ) : (
        <VireauLogoLight width={180} height={180} />
      )}
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
