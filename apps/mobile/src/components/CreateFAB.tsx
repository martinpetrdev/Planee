import { useRef } from 'react';

import { type BottomSheetRef, DropdownMenu, FAB } from '@repo/mobile-ui';

import { CreateQuickNoteSheet } from '@/sheets/CreateQuickNoteSheet';
import { CreateTaskSheet } from '@/sheets/CreateTaskSheet';

export function CreateFAB() {
  const createTaskSheetRef = useRef<BottomSheetRef>(null);
  const createQuickNoteSheetRef = useRef<BottomSheetRef>(null);

  return (
    <>
      <DropdownMenu
        items={[
          {
            label: 'Quick note',
            icon: 'note_stack_add',
            onClick: () => createQuickNoteSheetRef.current?.open(),
          },
          {
            label: 'Task',
            icon: 'add_task',
            onClick: () => createTaskSheetRef.current?.open(),
          },
          {
            label: 'Event',
            icon: 'calendar_today',
            onClick: () => {},
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
      <CreateQuickNoteSheet sheetRef={createQuickNoteSheetRef} />
    </>
  );
}
