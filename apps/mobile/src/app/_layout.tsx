import { AuthProvider, useAuth } from "@/auth/context";
import { LoadingScreenProvider } from "@/components/LoadingScreen";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@repo/mobile-ui";
import { FlagsProvider } from "@/services/flags/context";

const queryClient = new QueryClient();

function RootNavigator() {
  const auth = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
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
          <AuthProvider>
            <FlagsProvider>
              <RootNavigator />
            </FlagsProvider>
          </AuthProvider>
        </LoadingScreenProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
