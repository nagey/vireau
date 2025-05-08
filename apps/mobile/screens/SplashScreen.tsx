// apps/mobile/screens/SplashScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import VireauLogoLight from 'ui/LogoLight.svg';
import VireauLogoDark from 'ui/LogoDark.svg';
import { useThemeStyles } from '~/theme/useThemeStyles';

interface SplashScreenProps {
  onFinish: () => void;
  startFade: boolean;
}

export default function SplashScreen({
  onFinish,
  startFade,
}: SplashScreenProps) {
  const { colors, isDark } = useThemeStyles();
  const opacity = useRef(new Animated.Value(1)).current;
  const [minDone, setMinDone] = useState(false);
  const didFade = useRef(false);

  // enforce at least 1s of splash
  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // trigger fade when parent says so and min time passed
  useEffect(() => {
    if (startFade && minDone && !didFade.current) {
      didFade.current = true;
      // small buffer before starting fade
      const buffer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }).start(({ finished }) => finished && onFinish());
      }, 100);
      return () => clearTimeout(buffer);
    }
  }, [startFade, minDone, opacity, onFinish]);

  return (
    <View style={styles.wrapper}>
      {/* Animated overlay */}
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: colors.background, opacity },
        ]}
      />

      {/* Logo centered, shifted up 75px */}
      <View style={[styles.logoContainer, { transform: [{ translateY: -75 }] }]}>
        {isDark ? (
          <VireauLogoDark width={180} height={180} />
        ) : (
          <VireauLogoLight width={180} height={180} />
        )}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 999,            // ensure it sits on top
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
