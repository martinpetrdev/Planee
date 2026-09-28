import { useRouter } from 'expo-router';

import { Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TaskList } from '@/components/tasks/TaskList';

export default function Screen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader
          title="Tasks"
          trailingIcons={[
            {
              icon: 'check',
              onClick: () => router.push('/protected/tasks/completed'),
            },
          ]}
        />
        <TaskList
          onSeeOverdueClick={() => router.push('/protected/tasks/overdue')}
        />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
