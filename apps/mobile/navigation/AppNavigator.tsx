// app/mobile/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from '../screens/ExploreScreen';
import RaceScreen from '../screens/RaceScreen';
import OrganizeScreen from '../screens/OrganizeScreen';
import SailScreen from '../screens/SailScreen';
import QuickRaceScreen from '~/screens/QuickRaceScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Explore': iconName = 'search'; break;
            case 'Race': iconName = 'flag'; break;
            case 'Organize': iconName = 'clipboard'; break;
            case 'Sail': iconName = 'boat'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Race" component={RaceScreen} />
      <Tab.Screen name="Organize" component={OrganizeScreen} />
      <Tab.Screen name="Sail" component={SailScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="QuickRace" component={QuickRaceScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

