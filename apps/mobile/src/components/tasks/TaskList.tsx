import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

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

import { listTasks, type TaskResponseDto } from '@/api/modules/tasks';
import { NoTasksToday } from '@/components/tasks/NoTasks';
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
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

function NextPageLoader(props: INextPageLoaderProps) {
  if (!props.hasNextPage) return null;

  return (
    <>
      <ScrollPositionDetector
        onAppear={() => !props.isFetchingNextPage && props.fetchNextPage()}
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
  onSeeOverdueClick?: () => void;
}

export function TaskList(props: ITaskListProps) {
  const [selected, setSelected] = useState<TaskResponseDto | null>(null);
  const [refreshedManually, setRefreshedManually] = useState(false);

  const {
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    data,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['tasks', 'planned'],
    queryFn: ({ pageParam }: { pageParam: undefined | string }) =>
      listTasks({
        scope: 'planned',
        cursorId: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const {
    isFetching: isFetchingOverdue,
    data: overdue,
    refetch: refetchOverdue,
  } = useQuery({
    queryKey: ['tasks', 'overdue', 'partial'],
    queryFn: () =>
      listTasks({
        scope: 'overdue',
        limit: 2,
        order: 'desc', // Most actionable
      }),
  });

  const items = data?.pages.flatMap((page) => page.items);
  const hasToday =
    !!items?.length &&
    toISODate(new Date(items[0].dueDate)) === toISODate(new Date());

  return (
    <>
      <PullToRefresh
        isRefreshing={refreshedManually && (isFetching || isFetchingOverdue)}
        onRefresh={() => {
          setRefreshedManually(true);
          Promise.all([refetch(), refetchOverdue()]).finally(() =>
            setRefreshedManually(false),
          );
        }}
        gap={2}
        contentPadding={listContentPadding}
      >
        {overdue && overdue.total > 0 && (
          <>
            <SectionHeader
              title="Overdue"
              action={{
                label: `See all ${overdue.total}`,
                onClick: () => props.onSeeOverdueClick?.(),
              }}
            />
            {overdue.items.map((task, index) => (
              <Task
                task={task}
                onClick={() => setSelected(task)}
                isFirst={index === 0}
                isLast={index === overdue.items.length - 1}
                key={task.id}
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
          isFetchingNextPage={isFetchingNextPage}
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
}

export function BasicTaskList(props: IBasicTaskListProps) {
  const [selected, setSelected] = useState<TaskResponseDto | null>(null);
  const [refreshedManually, setRefreshedManually] = useState(false);

  const {
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    data,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['tasks', props.scope],
    queryFn: ({ pageParam }: { pageParam: undefined | string }) =>
      listTasks({
        scope: props.scope,
        cursorId: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const items = data?.pages.flatMap((page) => page.items);

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
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </PullToRefresh>

      {selected && (
        <UpdateTaskSheet task={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
