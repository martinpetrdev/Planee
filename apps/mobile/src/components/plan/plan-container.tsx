import { HorizontalDivider, useMaterialColors } from '@expo/ui/jetpack-compose';
import { offset } from '@expo/ui/jetpack-compose/modifiers';
import { DateTime } from 'luxon';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { Box, Column, Row, Text } from '@repo/mobile-ui';

interface IPlanContainerProps extends PropsWithChildren {}

export function PlanContainer(props: IPlanContainerProps) {
  const hourArray = useMemo(() => new Array(24).fill(0).map((_, i) => i), []);
  const [currentHour, setCurrentHour] = useState(0);

  const colors = useMaterialColors();

  useEffect(() => {
    const i = setInterval(() => {
      setCurrentHour(
        DateTime.now().hour +
          DateTime.now().minute / 60 +
          DateTime.now().second / (60 * 60),
      );
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, []);

  return (
    <Column scrollable flex>
      <Row>
        <Column size={[48, 64 * 24]}>
          {hourArray.map((h) => (
            <Column key={h} size={[48, 64]} horizontalAlignment="center">
              <Text>{h.toString().padStart(2, '0')}</Text>
            </Column>
          ))}
        </Column>
        <Column flex>
          <Box>
            <Column>
              {hourArray.map((h) => (
                <Box height={64} key={h} align="topCenter" paddingTop={8}>
                  <HorizontalDivider key={h} />
                </Box>
              ))}
            </Column>
            <HorizontalDivider
              color={colors.primary}
              thickness={2}
              modifiers={[offset(0, currentHour * 64 + 8)]}
            />
          </Box>
        </Column>
      </Row>
    </Column>
  );
}
