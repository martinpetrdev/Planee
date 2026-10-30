import { DateTime } from 'luxon';
import { useState } from 'react';

import { Box, Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB.tsx';
import { PlanContainer } from '@/components/plan/plan-container.tsx';
import { PlanDaySelector } from '@/components/plan/plan-day-selector.tsx';
import { ScreenHeader } from '@/components/ScreenHeader.tsx';

export default function Screen() {
  const [dayISO, setDayISO] = useState(DateTime.now().toISODate());

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader
          title={'Plan'}
          trailingIcons={[
            {
              icon: 'today',
              onClick: () => setDayISO(DateTime.now().toISODate()),
            },
          ]}
        />
        <PlanDaySelector dayISO={dayISO} setDayISO={setDayISO} />
        <Box paddingRight={8} paddingLeft={8} paddingTop={8}>
          <PlanContainer></PlanContainer>
        </Box>
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
