import { useRouter } from 'expo-router';

import { ScreenShell } from '@repo/mobile-ui';

import { ScreenHeader } from '@/components/ScreenHeader';

export default function Screen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <ScreenHeader
        title={'Notes'}
        leadingIcons={[
          {
            icon: 'arrow_back',
            onClick: () => router.back(),
          },
        ]}
      />
    </ScreenShell>
  );
}
