import { useRouter } from 'expo-router';

import { Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB';
import { QuickNoteList } from '@/components/quick-notes/QuickNoteList';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function Screen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader
          title={'Notes'}
          leadingIcons={[
            {
              icon: 'arrow_back',
              onClick: () => router.back(),
            },
          ]}
        />
        <QuickNoteList />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
