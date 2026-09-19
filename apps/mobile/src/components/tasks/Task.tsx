import { TaskResponseDto } from "@/api/modules/tasks";
import { Card, Column, Text } from "@repo/mobile-ui";

interface ITaskProps {
  task: TaskResponseDto;
  onClick: () => void;
}

export function Task(props: ITaskProps) {
  return (
    <Card fillWidth padding={16} onClick={props.onClick}>
      <Column gap={4}>
        <Text typography="bodyLarge">{props.task.name}</Text>
      </Column>
    </Card>
  );
}
