// app/mobile/screens/SplashScreen.tsx

import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import VireauLogoLight from 'ui/LogoLight.svg';
import VireauLogoDark from 'ui/LogoDark.svg';
import { useThemeStyles } from '~/theme/useThemeStyles';

interface SplashScreenProps {
  onFinish: () => void;
  startFade: boolean;
}

export default function SplashScreen({ onFinish, startFade }: SplashScreenProps) {
  const styles = useThemeStyles();
  const backgroundOpacity = useRef(new Animated.Value(1)).current;
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);
  const hasStartedFade = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimePassed(true);
    }, 1000); // Minimum 1s splash visible

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (startFade && minimumTimePassed && !hasStartedFade.current) {
      hasStartedFade.current = true;

      // Optional: slight buffer (100ms) before starting fade
      setTimeout(() => {
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 700, // ✅ Slower, smoother fade
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            onFinish();
          }
        });
      }, 100); // ✅ 100ms buffer after ready
    }
  }, [startFade, minimumTimePassed, backgroundOpacity, onFinish]);

  return (
    <View style={localStyles.absoluteFill}>
      {/* Animated background fades out */}
      <Animated.View
        style={[
          localStyles.backgroundOverlay,
          { backgroundColor: styles.colors.background, opacity: backgroundOpacity },
        ]}
      />

      {/* Static logo shifted 80px upward */}
      <View style={localStyles.centerContent}>
        {styles.isDark ? (
          <VireauLogoDark width={180} height={180} />
        ) : (
          <VireauLogoLight width={180} height={180} />
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: -75 }],
  },
});
