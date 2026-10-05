import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { TaskPageResponseDto, TaskResponseDto } from '@/api/modules/tasks';

export function mutateTaskQueries(
  queryClient: QueryClient,
  response: TaskResponseDto,
) {
  const replace = (tasks: TaskPageResponseDto) => ({
    ...tasks,
    items: tasks.items.map((t) => (t.id === response.id ? response : t)),
  });

  // Update the existing data instead of refetching the entire list
  queryClient.setQueriesData<
    TaskPageResponseDto | InfiniteData<TaskPageResponseDto>
  >({ queryKey: ['tasks'] }, (data) => {
    if (!data) return data;
    if ('pages' in data) return { ...data, pages: data.pages.map(replace) };

    return replace(data);
  });
}

export function refetchTaskQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['tasks'] });
}
