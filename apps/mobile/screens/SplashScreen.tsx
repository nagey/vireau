import { useColorScheme, StyleSheet, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useThemeStyles } from '~/theme/useThemeStyles';
import VireauLogoLight from 'ui/LogoLight.svg';
import VireauLogoDark from 'ui/LogoDark.svg';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const styles = { ...useThemeStyles(), ...localStyles};
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish(); // notify App that fade is done
      });
    }, 1000); // at least 1 second visible

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.container, styles.darkMode, opacity]}>
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
