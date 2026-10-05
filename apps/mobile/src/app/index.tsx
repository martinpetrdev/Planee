import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { ScreenShell } from '@repo/mobile-ui';

import { useAuth } from '@/auth/context';

export default function Screen() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoading) return; // Loading shown by useAuth

    if (auth.isAuthenticated) router.replace('/protected');
    else router.replace('/onboarding');
  }, [auth, router]);

  return <ScreenShell></ScreenShell>; // Return ScreenShell to prevent white flash
}
