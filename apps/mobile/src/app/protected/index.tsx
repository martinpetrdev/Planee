import { useMaterialColors } from '@expo/ui/jetpack-compose';

import { Column, Progressbar, Row, ScreenShell, Text } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB';
import { ActiveEventCard } from '@/components/home/status-cards/active-event.tsx';
import { ScreenHeader } from '@/components/ScreenHeader.tsx';
import { useFlags } from '@/services/flags/context.tsx';
import { getDatetime, getGreeting } from '@/utils/texts.ts';

export default function Screen() {
  const colors = useMaterialColors();

  const { flags } = useFlags();

  // TODO: Replace with real data
  const numberOfTasks = 12;
  const completedTasks = 10;

  return (
    <ScreenShell>
      {flags?.['new-home-screen'] === true ? (
        <Column fill padding={16} gap={16}>
          <Row
            paddingTop={24}
            paddingLeft={4}
            verticalAlignment="center"
            gap={16}
          >
            <Column flex gap={4}>
              <Text typography="labelLarge" color={colors.primary}>
                {getDatetime()}
              </Text>
              <Text typography="headlineMedium">{getGreeting()}</Text>
            </Column>
            <Progressbar
              min={0}
              max={numberOfTasks}
              current={completedTasks}
              label={`${completedTasks}/${numberOfTasks}`}
              variant="circular"
              size={64}
            />
          </Row>

          <ActiveEventCard />
        </Column>
      ) : (
        <ScreenHeader title={'Home'} />
      )}
      <CreateFAB />
    </ScreenShell>
  );
}
