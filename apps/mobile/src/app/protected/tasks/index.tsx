import { CreateFAB } from "@/components/CreateFAB";
import { TaskList } from "@/components/tasks/TaskList";
import { Column, ScreenShell, Text } from "@repo/mobile-ui";

export default function Screen() {
  return (
    <ScreenShell>
      <Column padding={16} fill gap={12}>
        <Text typography="headlineMedium">Tasks</Text>
        <TaskList />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
