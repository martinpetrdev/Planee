import { useRef } from 'react';

import { type BottomSheetRef, DropdownMenu, FAB } from '@repo/mobile-ui';

import { CreateTaskSheet } from '@/sheets/CreateTaskSheet';

export function CreateFAB() {
  const createTaskSheetRef = useRef<BottomSheetRef>(null);

  return (
    <>
      <DropdownMenu
        items={[
          /*{
            label: "Quick note",
            icon: "note_add",
            onClick: () => {},
          },*/
          {
            label: 'Task',
            icon: 'add_task',
            onClick: () => createTaskSheetRef.current?.open(),
          },
          /*{
            label: "Reminder",
            icon: "notification_add",
            onClick: () => {},
          },*/
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
