import { Redirect } from 'expo-router';

import { ScreenShell } from '@repo/mobile-ui';

import { useAuth } from '@/auth/context';

export default function Screen() {
  const auth = useAuth();

  // The exchange is done by auth context, just wait until it finishes
  if (auth.isLoading) return <ScreenShell></ScreenShell>; // Show screen shell to prevent white flash

  return <Redirect href="/" />;
}
