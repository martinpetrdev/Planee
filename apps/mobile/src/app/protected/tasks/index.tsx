import { CreateFAB } from "@/components/CreateFAB";
import { TaskList } from "@/components/tasks/TaskList";
import { Column, ScreenShell, Text } from "@repo/mobile-ui";

export default function Screen() {
  return (
    <ScreenShell>
      <Column padding={24} fill gap={16}>
        <Text typography="headlineMedium">Tasks</Text>
        <TaskList />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
