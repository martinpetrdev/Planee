import { Column, ScreenShell } from '@repo/mobile-ui';

import { ScreenHeader } from '@/components/ScreenHeader.tsx';

export default function Screen() {
  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader title={'Plan'} />
      </Column>
    </ScreenShell>
  );
}
