import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useThemeStyles } from '~/theme/useThemeStyles';
import VireauLogoLight from 'ui/LogoLight.svg';
import VireauLogoDark from 'ui/LogoDark.svg';
import GoogleIconLight from '~/assets/login/google-light.svg';
import GoogleIconDark from '~/assets/login/google-dark.svg';
import AppleIconLight from '~/assets/login/apple-light.svg';
import AppleIconDark from '~/assets/login/apple-dark.svg';

type LoginScreenProps = {
    login: (provider: string) => void;
    onReady?: () => void;
};

export default function LoginScreen({ login, onReady }: LoginScreenProps): JSX.Element {
    const styles = useThemeStyles();
  
    const handleGoogleLogin = () => {
      login('google');
    };
  
    const handleAppleLogin = () => {
      login('apple');
    };
  
    const googleScale = useRef(new Animated.Value(1)).current;
    const appleScale = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = (scaleRef) => {
      Animated.spring(scaleRef, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };
    
    const handlePressOut = (scaleRef) => {
      Animated.spring(scaleRef, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };
    
    return (
      <View style={[styles.appLogin, styles.darkMode]} onLayout={onReady} >
        <View style={styles.centerContent}>
            <View style={styles.logoContainer}>
                {styles.isDark ? (
                    <VireauLogoDark width={180} height={180} />
                ) : (
                    <VireauLogoLight width={180} height={180} />
                )}
            </View>

            <Text style={styles.loginTitle}>Welcome to Vireau</Text>
            <Text style={styles.loginSubtitle}>Your sailing adventures.</Text>

            {/* Apple Login Button */}
            <Animated.View style={{ transform: [{ scale: appleScale }] }}>
              <TouchableOpacity
                style={[styles.appleLoginButton, { marginBottom: 12 }]}
                onPressIn={() => handlePressIn(appleScale)}
                onPressOut={() => handlePressOut(appleScale)}
                onPress={handleAppleLogin}
                activeOpacity={0.8}
              >
                <View style={styles.appleInnerContent}>
                  <Text style={styles.appleGlyph}></Text>
                  <Text style={styles.appleLoginButtonText}>Sign in with Apple</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Google Login Button */}
            <Animated.View style={{ transform: [{ scale: googleScale }] }}>
              <TouchableOpacity
                style={styles.googleLoginButton}
                onPressIn={() => handlePressIn(googleScale)}
                onPressOut={() => handlePressOut(googleScale)}
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
              >
                {/* Absolutely positioned icon */}
                <View style={styles.googleIconContainer}>
                  {styles.isDark ? (
                    <GoogleIconDark width={32} height={32} />
                  ) : (
                    <GoogleIconLight width={32} height={32} />
                  )}
                </View>

                {/* Text centered fully */}
                <View style={styles.googleTextWrapper}>
                  <Text style={styles.googleLoginButtonText}>Sign in with Google</Text>
                </View>
                
              </TouchableOpacity>
            </Animated.View>

        </View>
      </View>
    );
  }
  