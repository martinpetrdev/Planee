import { TaskResponseDto } from "@/api/modules/tasks";
import {
  Card,
  Column,
  formatDuration,
  formatISOTime,
  Text,
  toISOTime,
} from "@repo/mobile-ui";

interface ITaskProps {
  task: TaskResponseDto;
}

export function Task(props: ITaskProps) {
  return (
    <Card fillWidth padding={16}>
      <Column gap={4}>
        <Text typography="bodyLarge">{props.task.name}</Text>
      </Column>
    </Card>
  );
}
