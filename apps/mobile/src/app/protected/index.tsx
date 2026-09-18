import { DropdownMenu, FAB, ScreenShell, Text } from "@repo/mobile-ui";

export default function Screen() {
  return (
    <ScreenShell>
      <Text>Home</Text>
      <DropdownMenu
        items={[
          {
            label: "Quick note",
            icon: "note_add",
            onClick: () => {},
          },
          {
            label: "Task",
            icon: "task_add",
            onClick: () => {},
          },
          {
            label: "Reminder",
            icon: "notification_add",
            onClick: () => {},
          },
        ]}
        trigger={(expanded, setExpanded) => (
          <FAB
            icon="add"
            styles={{ icon: { rotation: expanded ? 45 : 0 } }}
            onClick={() => setExpanded(true)}
          />
        )}
      />
    </ScreenShell>
  );
}
