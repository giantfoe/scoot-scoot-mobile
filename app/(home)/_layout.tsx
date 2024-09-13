import { Stack, Redirect } from 'expo-router';
import { useAuth } from '~/providers/AuthProvider';

export default function HomeLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Profile" />
    </Stack>
  );
}
