import { useMaterialColors } from "@expo/ui/jetpack-compose";
import { Column, Icon, Row, Text } from "@repo/mobile-ui";

export function NoCompletedTasks() {
  const materialColors = useMaterialColors();

  return (
    <Column horizontalAlignment="center" padding={32}>
      <Icon
        size={48}
        name="event_list"
        color={materialColors.onSurfaceVariant}
      />
      <Text
        typography="titleMedium"
        color={materialColors.onSurface}
        align="center"
        padding={[0, 16, 0, 8]}
      >
        No completed tasks yet
      </Text>
      <Text
        typography="bodyMedium"
        color={materialColors.onSurfaceVariant}
        align="center"
      >
        Complete your first task to see it appear here.
      </Text>
    </Column>
  );
}

export function NoTasksToday() {
  const materialColors = useMaterialColors();

  return (
    <Row verticalAlignment="center" gap={8}>
      <Icon size={24} name="check" color={materialColors.onSurfaceVariant} />
      <Text typography="bodyMedium" color={materialColors.onSurfaceVariant}>
        No tasks for today
      </Text>
    </Row>
  );
}
