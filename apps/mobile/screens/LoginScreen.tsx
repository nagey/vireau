import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { useThemeStyles } from '~/theme/useThemeStyles';
import VireauLogoLight from 'ui/LogoLight.svg';
import VireauLogoDark from 'ui/LogoDark.svg';
import GoogleIconLight from '~/assets/login/google-light.svg';
import GoogleIconDark from '~/assets/login/google-dark.svg';


export default function LoginScreen(login): JSX.Element {
    const styles = useThemeStyles();

    return (
        <View style={[styles.appLogin, styles.darkMode]}>
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

                <TouchableOpacity style={styles.loginButton} onPress={login}>
                {styles.isDark ? (
                    <GoogleIconDark width={24} height={24} style={styles.googleIcon} />
                ) : (
                    <GoogleIconLight width={24} height={24} style={styles.googleIcon} />
                )}
                <Text style={styles.loginButtonText}>Sign in with Google</Text>
                </TouchableOpacity>
            </View>
        </View>

      );
  }