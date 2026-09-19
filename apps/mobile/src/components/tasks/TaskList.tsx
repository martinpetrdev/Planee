import { listTasks } from "@/api/modules/tasks";
import { PAGE_SIZE } from "@repo/shared";
import {
  formatISODate,
  LoadingSpinner,
  PullToRefresh,
  Row,
  ScrollPositionDetector,
  Text,
} from "@repo/mobile-ui";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Task } from "./Task";
import { groupTasksByDay } from "@/utils/tasks/list";

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

export function TaskList() {
  const {
    isFetching: isFetchingOverdue,
    data: overdueTasks,
    refetch: refetchOverdue,
  } = useQuery({
    queryKey: ["tasks", "overdue"],
    queryFn: async () => await listTasks({ scope: "overdue" }),
  });

  const {
    isFetching: isFetchingToday,
    data: todayTasks,
    refetch: refetchToday,
  } = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: async () => await listTasks({ scope: "today" }),
  });

  const {
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    data,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["tasks", "upcoming"],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      await listTasks({ scope: "upcoming", cursorId: pageParam }),
    initialPageParam: undefined,
    // Short page is the last
    getNextPageParam: (lastPage) =>
      lastPage.length < PAGE_SIZE
        ? undefined
        : lastPage[lastPage.length - 1].id,
  });

  return (
    <PullToRefresh
      isRefreshing={
        (isFetching && !isFetchingNextPage) ||
        isFetchingToday ||
        isFetchingOverdue
      }
      onRefresh={() => {
        refetch();
        refetchToday();
        refetchOverdue();
      }}
      gap={8}
    >
      {!!overdueTasks?.length && [
        <SectionHeader key="overdue" title="Overdue" />,
        ...overdueTasks.map((task) => <Task key={task.id} task={task} />),
      ]}
      <SectionHeader title="Today" />
      {todayTasks?.length ? (
        todayTasks.map((task) => <Task key={task.id} task={task} />)
      ) : (
        <Text typography="bodySmall">Nothing due today.</Text>
      )}
      {data &&
        groupTasksByDay(data.pages.flat()).flatMap(([day, tasks]) => [
          <SectionHeader key={day} title={formatISODate(day)} />,
          ...tasks.map((task) => <Task key={task.id} task={task} />),
        ])}
      <ScrollPositionDetector onAppear={() => fetchNextPage()} />
      {hasNextPage && (
        <Row horizontalAlignment="center" padding={12}>
          <LoadingSpinner />
        </Row>
      )}
    </PullToRefresh>
  );
}
