import { Providers } from '@repo-shared/mobile-utils';
import { Stack } from 'expo-router';

function RootNavigator() {
  return (
    <Stack screenOptions={{ animation: 'none', headerShown: false }}>
      <Stack.Protected guard={true}>
        <Stack.Screen name="protected" />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <Providers providers={[]}>
      <RootNavigator />
    </Providers>
  );
}
