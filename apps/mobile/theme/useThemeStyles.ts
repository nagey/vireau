import { useColorScheme } from 'react-native';

export function useThemeStyles() {
  const scheme = useColorScheme();
console.log(scheme)
  const isDark = scheme === 'dark';

  const colors = {
    background: isDark ? '#001F3F' : '#ffffff',
    text: isDark ? '#ffffff' : '#001F3F',
    border: isDark ? '#444' : '#ccc',
    button: isDark ? '#ffffff' : '#001F3F',
    buttonText: isDark ? '#001F3F' : '#ffffff',
  };

  return {
    isDark,
    colors,
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 80,
      paddingHorizontal: 24,
      alignItems: 'center'
    },
    text: {
      color: colors.text,
      fontSize: 16,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20
    },
    button: {
      backgroundColor: colors.button,
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 16,
    },
  };
}
