import { DateTime } from 'luxon';
import { useState } from 'react';

import { Box, Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB.tsx';
import { PlanContainer } from '@/components/plan/plan-container.tsx';
import { PlanDaySelector } from '@/components/plan/plan-day-selector.tsx';
import { ScreenHeader } from '@/components/ScreenHeader.tsx';

export default function Screen() {
  const [dayISO, setDayISO] = useState(DateTime.now().toISODate());
  const [scrollToNowRequest, setScrollToNowRequest] = useState(0);

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader
          title={'Plan'}
          trailingIcons={[
            {
              icon: 'today',
              onClick: () => {
                setDayISO(DateTime.now().toISODate());
                setScrollToNowRequest((r) => r + 1);
              },
            },
          ]}
        />
        <PlanDaySelector dayISO={dayISO} setDayISO={setDayISO} />
        <Box paddingRight={16} paddingLeft={4} paddingTop={8}>
          <PlanContainer
            showCurrentTimeMarker={dayISO === DateTime.now().toISODate()}
            scrollToNowRequest={scrollToNowRequest}
            blocks={[
              {
                title: 'Test',
                startHour: 10,
                endHour: 13.5,
              },
              {
                title: 'Abc',
                startHour: 11,
                endHour: 12,
              },
            ]}
          />
        </Box>
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
