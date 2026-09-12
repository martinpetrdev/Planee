import { AuthProvider, useAuth } from "@/auth/context";
import { LoadingScreenProvider } from "@/components/LoadingScreen";
import { Stack } from "expo-router";

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
    <LoadingScreenProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </LoadingScreenProvider>
  );
}
