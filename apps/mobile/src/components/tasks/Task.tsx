import { TaskResponseDto } from "@/api/modules/tasks";
import { Box, Card, Text } from "@repo/mobile-ui";

interface ITaskProps {
  task: TaskResponseDto;
}

export function Task(props: ITaskProps) {
  return (
    <Card fillWidth padding={16}>
      <Text>{props.task.name}</Text>
    </Card>
  );
}
