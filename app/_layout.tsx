import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ForwardRefWrapper from '~/components/ForwardRefWrapper';

import AuthProvider from '~/providers/AuthProvider';
import ScooterProvider from '~/providers/ScooterProvider';

const WrappedStack = (props: any) => (
  <ForwardRefWrapper component={Stack} {...props} />
);

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <AuthProvider>
        <ScooterProvider>
          <WrappedStack screenOptions={{ headerShown: false }} />
        </ScooterProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
