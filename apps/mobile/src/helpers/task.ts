import { TaskResponseDto } from "@/api/modules/tasks";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

export function mutateTaskQueries(
  queryClient: QueryClient,
  response: TaskResponseDto,
) {
  const replace = (tasks: TaskResponseDto[]) =>
    tasks.map((t) => (t.id == response.id ? response : t));

  // Update the existing data instead of refetching the entire list
  queryClient.setQueriesData<
    TaskResponseDto[] | InfiniteData<TaskResponseDto[]>
  >({ queryKey: ["tasks"] }, (data) => {
    if (!data) return data;
    if (Array.isArray(data)) return replace(data);

    return { ...data, pages: data.pages.map(replace) };
  });
}

export function refetchTaskQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
}
