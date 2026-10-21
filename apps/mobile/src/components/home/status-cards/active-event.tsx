import { useMaterialColors } from '@expo/ui/jetpack-compose';

import {
  Box,
  Button,
  Card,
  Column,
  Icon,
  Progressbar,
  Row,
  Spacer,
  Text,
} from '@repo/mobile-ui';

export function ActiveEventCard() {
  const colors = useMaterialColors();

  // TODO: Replace with real data
  const elapsed = 64;
  const total = 90;

  return (
    <Card
      color={colors.primaryContainer}
      borderRadius={24}
      padding={20}
      fillWidth
    >
      <Column gap={16}>
        <Column gap={4}>
          <Row fit gap={8} verticalAlignment="center">
            <Box
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={colors.primary}
            />
            <Text typography="labelLarge" color={colors.onPrimaryContainer}>
              Now · 13:00-14:30
            </Text>
          </Row>
          <Text typography="headlineSmall" color={colors.onPrimaryContainer}>
            My important task
          </Text>
        </Column>

        <Column gap={6}>
          <Progressbar
            min={0}
            max={total}
            current={elapsed}
            variant="linear-wavy"
            color={colors.primary}
            trackColor={colors.surfaceContainerLowest}
          />
          <Row>
            <Text typography="labelMedium" color={colors.onPrimaryContainer}>
              {elapsed} min in
            </Text>
            <Spacer />
            <Text typography="labelMedium" color={colors.onPrimaryContainer}>
              {total - elapsed} min left
            </Text>
          </Row>
        </Column>

        <Row gap={8}>
          <Box flex>
            <Button
              variant="elevated"
              fullWidth
              icon={(color) => <Icon name="stop" size={18} color={color} />}
              onClick={() => {}}
            >
              Stop
            </Button>
          </Box>
          <Box flex>
            <Button
              fullWidth
              icon={(color) => <Icon name="check" size={18} color={color} />}
              onClick={() => {}}
            >
              Done
            </Button>
          </Box>
        </Row>
      </Column>
    </Card>
  );
}
