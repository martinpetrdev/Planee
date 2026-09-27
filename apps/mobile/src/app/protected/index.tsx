import { Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function Screen() {
  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader title="Home" />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
