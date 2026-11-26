import { ScreenShell } from '@repo-shared/mobile-ui';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function Screen() {
  useEffect(() => {
    router.replace('/onboarding');
  }, []);

  return <ScreenShell></ScreenShell>;
}
