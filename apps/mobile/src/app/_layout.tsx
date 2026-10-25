import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { SnackbarProvider } from '@repo/mobile-ui';

import { AuthProvider, useAuth } from '@/auth/context';
import { LoadingScreenProvider } from '@/components/LoadingScreen';
import { FlagsProvider } from '@/services/flags/context';
import { InAppUpdatesProvider } from '@/services/InAppUpdatesProvider';
import { TPNothingGlyphProvider } from '@/services/third-party/nothing/glyph.tsx';

const queryClient = new QueryClient();

function RootNavigator() {
  const auth = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Protected guard={auth.isAuthenticated}>
        <Stack.Screen name="protected" />
      </Stack.Protected>

      <Stack.Protected guard={!auth.isAuthenticated}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <LoadingScreenProvider>
          <InAppUpdatesProvider>
            <AuthProvider>
              <FlagsProvider>
                <TPNothingGlyphProvider>
                  <RootNavigator />
                </TPNothingGlyphProvider>
              </FlagsProvider>
            </AuthProvider>
          </InAppUpdatesProvider>
        </LoadingScreenProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
