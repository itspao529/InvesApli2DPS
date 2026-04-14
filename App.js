import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Esta es la ruta exacta según tu panel izquierdo en Android Studio
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0A0A0F" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}