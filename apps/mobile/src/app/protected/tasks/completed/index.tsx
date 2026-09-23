import { CreateFAB } from "@/components/CreateFAB";
import { CompletedTaskList } from "@/components/tasks/TaskList";
import { Button, Column, Icon, Row, ScreenShell, Text } from "@repo/mobile-ui";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <Column fill>
        <Row verticalAlignment="center" padding={4}>
          <Button variant="icon" onClick={() => router.back()}>
            <Icon name="arrow_back" />
          </Button>
          <Text typography="titleLarge">Completed tasks</Text>
        </Row>
        <Column flex padding={16}>
          <CompletedTaskList />
        </Column>
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
