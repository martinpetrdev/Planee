import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

import {
  Button,
  formatISODate,
  LoadingSpinner,
  PullToRefresh,
  Row,
  ScrollPositionDetector,
  Text,
} from '@repo/mobile-ui';

import { listTasks, type TaskResponseDto } from '@/api/modules/tasks';
import { UpdateTaskSheet } from '@/sheets/UpdateTaskSheet';
import { groupTasksByDay } from '@/utils/tasks/list';
import { Task } from './Task';

interface ISectionHeaderProps {
  title: string;
}

function SectionHeader(props: ISectionHeaderProps) {
  return (
    <Text typography="titleSmall" padding={[0, 8, 0, 4]}>
      {props.title}
    </Text>
  );
}

interface ITaskListProps {
  onSeeOverdueClick?: () => void;
}

export function TaskList(props: ITaskListProps) {
  const [selected, setSelected] = useState<TaskResponseDto | null>(null);
  const [refreshedManually, setRefreshedManually] = useState(false);

  const { isFetching, hasNextPage, data, refetch, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['tasks', 'planned'],
      queryFn: async ({ pageParam }: { pageParam: undefined | string }) =>
        await listTasks({
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
    queryFn: async () =>
      await listTasks({
        scope: 'overdue',
        limit: 2,
      }),
  });

  const items = data?.pages?.flatMap((page) => page.items);

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
        gap={8}
      >
        {overdue && overdue.total > 0 && (
          <>
            <SectionHeader title={'Overdue'} />
            {overdue.items.map((task) => (
              <Task
                task={task}
                onClick={() => setSelected(task)}
                key={task.id}
              />
            ))}
            <Button
              variant="text"
              onClick={() => {
                props.onSeeOverdueClick?.();
              }}
            >
              See all {overdue.total} overdue tasks
            </Button>
          </>
        )}

        {items &&
          (items.length > 0 ? (
            groupTasksByDay(items).flatMap(([day, tasks]) => [
              <SectionHeader title={formatISODate(day)} key={day} />,
              ...tasks.map((task) => (
                <Task
                  task={task}
                  onClick={() => setSelected(task)}
                  key={task.id}
                />
              )),
            ])
          ) : (
            <></>
          ))}
        <ScrollPositionDetector onAppear={() => fetchNextPage()} />
        {hasNextPage && (
          <Row horizontalAlignment="center" padding={12}>
            <LoadingSpinner />
          </Row>
        )}
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

  const { isFetching, hasNextPage, data, refetch, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['tasks', props.scope],
      queryFn: async ({ pageParam }: { pageParam: undefined | string }) =>
        await listTasks({
          scope: props.scope,
          cursorId: pageParam,
        }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const items = data?.pages?.flatMap((page) => page.items);

  return (
    <>
      <PullToRefresh
        isRefreshing={refreshedManually && isFetching}
        onRefresh={() => {
          setRefreshedManually(true);
          refetch().finally(() => setRefreshedManually(false));
        }}
        gap={8}
      >
        {items &&
          (items.length > 0
            ? groupTasksByDay(items).flatMap(([day, tasks]) => [
                <SectionHeader title={formatISODate(day)} key={day} />,
                ...tasks.map((task) => (
                  <Task
                    task={task}
                    onClick={() => setSelected(task)}
                    key={task.id}
                  />
                )),
              ])
            : props.noContentIndicator)}
        <ScrollPositionDetector onAppear={() => fetchNextPage()} />
        {hasNextPage && (
          <Row horizontalAlignment="center" padding={12}>
            <LoadingSpinner />
          </Row>
        )}
      </PullToRefresh>

      {selected && (
        <UpdateTaskSheet task={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
