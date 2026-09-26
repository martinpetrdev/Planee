import { CreateFAB } from "@/components/CreateFAB";
import { ScreenHeader } from "@/components/ScreenHeader";
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
        <ScreenHeader
          title="Tasks"
          trailingIcons={[
            {
              icon: "check",
              onClick: () => router.push("/protected/tasks/completed"),
            },
          ]}
        />
        <Column flex padding={16}>
          <TaskList />
        </Column>
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
