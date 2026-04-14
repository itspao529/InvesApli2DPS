// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import FirebaseScreen  from '../screens/FirebaseScreen';
import SettingsScreen  from '../screens/SettingsScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: ['pulse',    'pulse-outline'],
  Firebase:  ['flame',    'flame-outline'],
  Ajustes:   ['settings', 'settings-outline'],
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 0.5,
          },
          tabBarActiveTintColor:   COLORS.accent,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarIcon: ({ focused, color, size }) => {
            const [active, inactive] = ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];
            return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Firebase"  component={FirebaseScreen} />
        <Tab.Screen name="Ajustes"   component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
