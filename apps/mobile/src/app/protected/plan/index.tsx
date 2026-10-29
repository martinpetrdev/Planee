import { Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB.tsx';
import { ScreenHeader } from '@/components/ScreenHeader.tsx';

export default function Screen() {
  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader title={'Plan'} />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
