import { DateTime } from 'luxon';
import { Dispatch, SetStateAction } from 'react';

import { Button, Icon, Row, Spacer, Text } from '@repo/mobile-ui';

interface IPlanDaySelectorProps {
  dayISO: string;
  setDayISO: Dispatch<SetStateAction<string>>;
}

export function PlanDaySelector(props: IPlanDaySelectorProps) {
  const today = DateTime.fromISO(DateTime.now().toISODate());
  const day = DateTime.fromISO(props.dayISO);

  const isToday = today.equals(day);

  return (
    <Row verticalAlignment="center" paddingRight={8} paddingLeft={8}>
      <Button
        onClick={() => {
          props.setDayISO(
            (c: string) => DateTime.fromISO(c).minus({ days: 1 }).toISODate()!,
          );
        }}
        variant="icon"
      >
        <Icon name="chevron_left" />
      </Button>
      <Spacer />
      <Text>{isToday ? 'Today' : day.toFormat('dd. MM. yyyy')}</Text>
      <Spacer />
      <Button
        onClick={() =>
          props.setDayISO(
            (c: string) => DateTime.fromISO(c).plus({ days: 1 }).toISO()!,
          )
        }
        variant="icon"
      >
        <Icon name="chevron_right" />
      </Button>
    </Row>
  );
}
