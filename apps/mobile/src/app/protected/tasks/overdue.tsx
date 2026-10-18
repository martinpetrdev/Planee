import { useRouter } from 'expo-router';

import { Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB';
import { ScreenHeader } from '@/components/ScreenHeader';
import { NoOverdueTasks } from '@/components/tasks/NoTasks';
import { BasicTaskList } from '@/components/tasks/TaskList';
import { OverdueTaskRepository } from '@/repositories/overdue.task.repository';

export default function Screen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader
          title="Overdue tasks"
          leadingIcons={[
            {
              icon: 'arrow_back',
              onClick: () => router.back(),
            },
          ]}
        />
        <BasicTaskList
          scope={'overdue'}
          noContentIndicator={<NoOverdueTasks />}
          repository={OverdueTaskRepository}
        />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
