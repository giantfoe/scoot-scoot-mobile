import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthProvider from '~/providers/AuthProvider';
import ScooterProvider from '~/providers/ScooterProvider';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <AuthProvider>
        <ScooterProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ScooterProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
