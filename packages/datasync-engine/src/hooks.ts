import { useCallback, useSyncExternalStore } from "react";
import type { Repository } from "./repository.ts";

export function useRepository<T>(repository: Repository<T>) {
	const data = useSyncExternalStore(
		(onChange) => repository.$onChange(onChange),
		() => repository.data,
	);
	const isFetching = useSyncExternalStore(
		(onChange) => repository.$onStatusChange(onChange),
		() => repository.isFetching,
	);

	const hasNextPage = useSyncExternalStore(
		(onChange) => repository.$onNextCursorChange(onChange),
		() => repository.hasNextPage,
	);

	const refetch = useCallback(() => repository.requestRefetch(), [repository]);
	const fetchNextPage = useCallback(
		() => repository.fetchNextPage(),
		[repository],
	);

	return { data, refetch, isFetching, hasNextPage, fetchNextPage };
}
