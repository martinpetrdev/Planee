import { CreateFAB } from "@/components/CreateFAB";
import { TaskList } from "@/components/tasks/TaskList";
import {
  Button,
  Column,
  Icon,
  Row,
  ScreenShell,
  Spacer,
  Text,
} from "@repo/mobile-ui";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <Column fill>
        <Row verticalAlignment="center" padding={4}>
          <Text typography="titleLarge" padding={[12, 0, 0, 0]}>
            Tasks
          </Text>
          <Spacer />
          <Button
            variant="icon"
            onClick={() => router.push("/protected/tasks/completed")}
          >
            <Icon name="check" />
          </Button>
        </Row>
        <Column flex padding={16}>
          <TaskList />
        </Column>
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
