import { listTasks } from "@/api/modules/tasks";
import { PullToRefresh, Text } from "@repo/mobile-ui";
import { useQuery } from "@tanstack/react-query";
import { Task } from "./Task";

export function TaskList() {
  const { isFetching, data, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => await listTasks(),
  });

  return (
    <PullToRefresh
      isRefreshing={isFetching}
      onRefresh={() => refetch()}
      gap={8}
    >
      {data && data.map((task) => <Task task={task} key={task.id} />)}
    </PullToRefresh>
  );
}
