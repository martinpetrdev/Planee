import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { type ReactNode, useState } from 'react';

import { Repository, useRepository } from '@repo/datasync-engine';
import {
  formatISODate,
  Icon,
  LoadingSpinner,
  PullToRefresh,
  Row,
  ScrollPositionDetector,
  Spacer,
  Text,
  toISODate,
} from '@repo/mobile-ui';

import type { TaskResponseDto } from '@/api/modules/tasks';
import { NoTasksToday } from '@/components/tasks/NoTasks';
import { useOverdueTaskRepository } from '@/repositories/overdue.task.repository';
import { usePlannedTaskRepository } from '@/repositories/planned.task.repository';
import { UpdateTaskSheet } from '@/sheets/UpdateTaskSheet';
import { groupTasksByDay } from '@/utils/tasks/list';
import { Task } from './Task';

interface ISectionHeaderProps {
  title: string;
  action?: { label: string; onClick: () => void };
}

function SectionHeader(props: ISectionHeaderProps) {
  const materialColors = useMaterialColors();

  if (!props.action) {
    return (
      <Text typography="titleSmall" padding={[0, 16, 0, 8]}>
        {props.title}
      </Text>
    );
  }

  return (
    <Row verticalAlignment="center">
      <Text typography="titleSmall" padding={[0, 16, 0, 8]}>
        {props.title}
      </Text>
      <Spacer />
      <Row
        verticalAlignment="center"
        paddingLeft={8}
        paddingTop={8}
        paddingBottom={4}
        fit
        onClick={() => props.action?.onClick()}
      >
        <Text typography="labelLarge" color={materialColors.primary}>
          {props.action.label}
        </Text>
        <Icon name="chevron_right" size={18} color={materialColors.primary} />
      </Row>
    </Row>
  );
}

// 88 is there to land above FAB, so it is not covered by it.
const listContentPadding = { start: 16, end: 16, bottom: 88 };

interface INextPageLoaderProps {
  hasNextPage: boolean;
  loadedCount: number;
  fetchNextPage: () => void;
}

function NextPageLoader(props: INextPageLoaderProps) {
  if (!props.hasNextPage) return null;

  return (
    <>
      {/* Remount after each page, so it fires again when it stays visible
          Fixed by Claude Code (Claude Opus 5.5) */}
      <ScrollPositionDetector
        key={props.loadedCount}
        onAppear={props.fetchNextPage}
      />
      <Row horizontalAlignment="center" padding={12}>
        <LoadingSpinner />
      </Row>
    </>
  );
}

function renderTaskGroups(
  tasks: TaskResponseDto[],
  onClick: (task: TaskResponseDto) => void,
) {
  const today = toISODate(new Date());

  return groupTasksByDay(tasks).flatMap(([day, dayTasks]) => [
    <SectionHeader
      title={day === today ? 'Today' : formatISODate(day)}
      key={day}
    />,
    ...dayTasks.map((task, index) => (
      <Task
        task={task}
        onClick={() => onClick(task)}
        isFirst={index === 0}
        isLast={index === dayTasks.length - 1}
        key={task.id}
      />
    )),
  ]);
}

interface ITaskListProps {
  header?: ReactNode;
  onRefetch?: () => void;
  onSeeOverdueClick?: () => void;
}

export function TaskList(props: ITaskListProps) {
  const [selected, setSelected] = useState<TaskResponseDto | null>(null);
  const [refreshedManually, setRefreshedManually] = useState(false);

  const {
    data: items,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = usePlannedTaskRepository();

  const {
    isFetching: isFetchingOverdue,
    data: overdueItems,
    total: overdueTotal,
    refetch: refetchOverdue,
  } = useOverdueTaskRepository();
  const overdue = overdueItems?.slice(0, 2) ?? []; // Most actionable

  const hasToday =
    !!items?.length &&
    toISODate(new Date(items[0].dueDate)) === toISODate(new Date());

  return (
    <>
      <PullToRefresh
        isRefreshing={refreshedManually && (isFetching || isFetchingOverdue)}
        onRefresh={() => {
          setRefreshedManually(true);

          Promise.all([
            refetch(),
            refetchOverdue(),
            props.onRefetch?.(),
          ]).finally(() => setRefreshedManually(false));
        }}
        gap={2}
        contentPadding={listContentPadding}
      >
        {props.header}
        {overdue.length > 0 && (
          <>
            <SectionHeader
              title="Overdue"
              action={
                overdueTotal > 2
                  ? {
                      label: `See all ${overdueTotal}`,
                      onClick: () => props.onSeeOverdueClick?.(),
                    }
                  : undefined
              }
            />
            {overdue.map((task, index) => (
              <Task
                task={task}
                onClick={() => setSelected(task)}
                isFirst={index === 0}
                isLast={index === overdue.length - 1}
                key={task.id}
                showDate
              />
            ))}
          </>
        )}

        {items && !hasToday && (
          <>
            <SectionHeader title={'Today'} />
            <NoTasksToday />
          </>
        )}
        {items && renderTaskGroups(items, setSelected)}
        <NextPageLoader
          hasNextPage={hasNextPage}
          loadedCount={items?.length ?? 0}
          fetchNextPage={fetchNextPage}
        />
      </PullToRefresh>

      {selected && (
        <UpdateTaskSheet task={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

interface IBasicTaskListProps {
  scope: 'completed' | 'overdue';
  noContentIndicator?: ReactNode;
  repository: Repository<TaskResponseDto>;
}

export function BasicTaskList(props: IBasicTaskListProps) {
  const [selected, setSelected] = useState<TaskResponseDto | null>(null);
  const [refreshedManually, setRefreshedManually] = useState(false);

  const {
    isFetching,
    hasNextPage,
    data: items,
    refetch,
    fetchNextPage,
  } = useRepository(props.repository);

  return (
    <>
      <PullToRefresh
        isRefreshing={refreshedManually && isFetching}
        onRefresh={() => {
          setRefreshedManually(true);
          refetch().finally(() => setRefreshedManually(false));
        }}
        gap={2}
        contentPadding={listContentPadding}
      >
        {items &&
          (items.length > 0
            ? renderTaskGroups(items, setSelected)
            : props.noContentIndicator)}
        <NextPageLoader
          hasNextPage={hasNextPage}
          loadedCount={items?.length ?? 0}
          fetchNextPage={fetchNextPage}
        />
      </PullToRefresh>

      {selected && (
        <UpdateTaskSheet task={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
