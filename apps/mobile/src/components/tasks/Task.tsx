import { TaskResponseDto } from "@/api/modules/tasks";
import { useMaterialColors } from "@expo/ui/jetpack-compose";
import { Badge, Card, Checkbox, Column, Row, Text } from "@repo/mobile-ui";
import { DateTime, Duration } from "luxon";

interface ITaskProps {
  task: TaskResponseDto;
  onClick: () => void;
}

export function Task(props: ITaskProps) {
  const materialColors = useMaterialColors();

  const duration = Duration.fromObject({
    seconds: props.task.expectedDurationSeconds,
  });
  const durationLabel = duration.toFormat(
    duration.as("hours") >= 1 ? "h'h' m'min'" : "m'min'",
  );

  return (
    <Card fillWidth padding={16} paddingLeft={8} onClick={props.onClick}>
      <Row gap={4} verticalAlignment="center">
        <Checkbox />
        <Column flex gap={6}>
          <Text typography="bodyLarge">{props.task.name}</Text>
          <Row verticalAlignment="center" gap={8}>
            <Text
              typography="bodySmall"
              color={materialColors.onSurfaceVariant}
            >
              {DateTime.fromISO(props.task.dueDate).toFormat("HH:mm")} ·{" "}
              {durationLabel}
            </Text>
            {props.task.priority == "low" && (
              <Badge label="Low priority" color="secondary" />
            )}
            {props.task.priority == "high" && (
              <Badge label="High priority" color="red" />
            )}
          </Row>
        </Column>
      </Row>
    </Card>
  );
}
