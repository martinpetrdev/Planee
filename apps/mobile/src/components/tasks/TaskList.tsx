import { listTasks } from "@/api/modules/tasks";
import {
  Box,
  formatISODate,
  LoadingSpinner,
  PullToRefresh,
  ScrollPositionDetector,
  Text,
} from "@repo/mobile-ui";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Task } from "./Task";
import { groupTasksByDay } from "@/utils/tasks/list";

export function TaskList() {
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
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.id,
  });

  return (
    <PullToRefresh
      isRefreshing={(isFetching && !isFetchingNextPage) || isFetchingToday}
      onRefresh={() => {
        refetch();
        refetchToday();
      }}
      gap={8}
    >
      <Text typography="titleMedium">Today</Text>
      {todayTasks &&
        todayTasks.map((task) => <Task key={task.id} task={task} />)}
      {data &&
        groupTasksByDay(data.pages.flat()).flatMap(([day, tasks]) => [
          <Text key={day} typography="titleMedium">
            {formatISODate(day)}
          </Text>,
          ...tasks.map((task) => <Task key={task.id} task={task} />),
        ])}
      <ScrollPositionDetector onAppear={() => fetchNextPage()} />
      {hasNextPage && (
        <Box align="center" flex>
          <LoadingSpinner />
        </Box>
      )}
    </PullToRefresh>
  );
}
