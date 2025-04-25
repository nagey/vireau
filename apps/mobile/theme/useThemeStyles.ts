import { useColorScheme } from 'react-native';

export function useThemeStyles() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const colors = {
    background: isDark ? '#001F3F' : '#ffffff',
    text: isDark ? '#ffffff' : '#001F3F',
    border: isDark ? '#444' : '#ccc',
    button: isDark ? '#ffffff' : '#001F3F',
    buttonText: isDark ? '#001F3F' : '#ffffff',
    surface: isDark ? '#1f1f1f' : '#f2f2f2',
    accent: '#F46036',
    primary: '#0D3B66',
    secondaryText: isDark ? '#ccc' : '#666'
  };

  return {
    isDark,
    colors,
    darkMode: {
      backgroundColor: isDark ? '#001F3F': '#ffffff'
    },
    appHome: {
      flex: 1
    },
    appLogin: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
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

    // NEW styles for ExploreScreen
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 56,
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.primary,
    },
    headerText: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 8,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    searchContainer: {
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingBottom: 8,
      paddingTop: 8,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: colors.text,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 4,
      marginHorizontal: 16,
      color: colors.text,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    thumbnail: {
      width: 48,
      height: 48,
      borderRadius: 8,
      marginRight: 12,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    itemSubtitle: {
      fontSize: 14,
      color: colors.secondaryText,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      backgroundColor: colors.accent,
      padding: 16,
      borderRadius: 32,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
  };
}
