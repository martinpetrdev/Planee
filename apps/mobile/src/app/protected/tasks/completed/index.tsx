import { useRouter } from 'expo-router';

import { Column, ScreenShell } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CompletedTaskList } from '@/components/tasks/TaskList';

export default function Screen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <Column fill>
        <ScreenHeader
          title="Completed tasks"
          leadingIcons={[
            {
              icon: 'arrow_back',
              onClick: () => router.back(),
            },
          ]}
        />
        <Column flex padding={16}>
          <CompletedTaskList />
        </Column>
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
