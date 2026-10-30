import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { getLocales } from 'expo-localization';
import { DateTime } from 'luxon';
import { Dispatch, SetStateAction } from 'react';

import { Button, Column, Icon, Row, Text } from '@repo/mobile-ui';

import { capitalize } from '@/utils/texts.ts';

interface IPlanDaySelectorProps {
  dayISO: string;
  setDayISO: Dispatch<SetStateAction<string>>;
}

export function PlanDaySelector(props: IPlanDaySelectorProps) {
  const colors = useMaterialColors();
  const today = DateTime.fromISO(DateTime.now().toISODate());
  const day = DateTime.fromISO(props.dayISO);

  const isToday = today.equals(day);

  const shift = (days: number) =>
    props.setDayISO((c) => DateTime.fromISO(c).plus({ days }).toISODate()!);

  return (
    <Row verticalAlignment="center" paddingRight={8} paddingLeft={8}>
      <Button onClick={() => shift(-1)} variant="icon">
        <Icon name="chevron_left" color={colors.onSurfaceVariant} />
      </Button>
      <Column flex horizontalAlignment="center">
        <Text typography="titleMedium">
          {isToday
            ? 'Today'
            : capitalize(
                day.setLocale(getLocales()[0]?.languageTag).toFormat('cccc'),
              )}
        </Text>
        <Text typography="labelMedium" color={colors.onSurfaceVariant}>
          {day.setLocale(getLocales()[0]?.languageTag).toFormat('d. MMMM yyyy')}
        </Text>
      </Column>
      <Button onClick={() => shift(1)} variant="icon">
        <Icon name="chevron_right" color={colors.onSurfaceVariant} />
      </Button>
    </Row>
  );
}
