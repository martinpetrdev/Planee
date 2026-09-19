import { CreateTaskSheet } from "@/sheets/CreateTaskSheet";
import { BottomSheetRef, DropdownMenu, FAB } from "@repo/mobile-ui";
import { useRef } from "react";

export function CreateFAB() {
  const createTaskSheetRef = useRef<BottomSheetRef>(null);

  return (
    <>
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
            onClick: () => createTaskSheetRef.current?.open(),
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

      <CreateTaskSheet sheetRef={createTaskSheetRef} />
    </>
  );
}
