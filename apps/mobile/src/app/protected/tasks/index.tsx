import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { useRouter } from 'expo-router';

import { Card, Column, Icon, Row, ScreenShell, Text } from '@repo/mobile-ui';

import { CreateFAB } from '@/components/CreateFAB';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { useQuickNoteRepository } from '@/repositories/quickNote.repository';

export default function Screen() {
  const router = useRouter();
  const materialColors = useMaterialColors();

  const {
    data: quickNotes,
    isFetching: quickNotesLoading,
    refetch: refetchQuickNotes,
  } = useQuickNoteRepository();

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
          onRefetch={refetchQuickNotes}
          header={
            !quickNotesLoading &&
            (quickNotes?.length ?? 0) > 0 && (
              <Row paddingBottom={8}>
                <Card
                  onClick={() => router.push('/protected/tasks/quick-notes')}
                  padding={12}
                  paddingLeft={16}
                  borderRadius={16}
                  fillWidth
                >
                  <Row verticalAlignment="center" gap={16}>
                    <Icon name="inbox" color={materialColors.primary} />
                    <Column flex gap={2}>
                      <Text typography="titleSmall">
                        {quickNotes?.length ?? -1} unprocessed notes
                      </Text>
                      <Text
                        color={materialColors.onSurfaceVariant}
                        typography="bodyMedium"
                      >
                        Turn them into tasks
                      </Text>
                    </Column>
                    <Icon
                      name="chevron_right"
                      color={materialColors.onSurfaceVariant}
                    />
                  </Row>
                </Card>
              </Row>
            )
          }
          onSeeOverdueClick={() => router.push('/protected/tasks/overdue')}
        />
      </Column>
      <CreateFAB />
    </ScreenShell>
  );
}
