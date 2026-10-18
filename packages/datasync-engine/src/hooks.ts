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

	const refetch = useCallback(() => repository.requestRefetch(), [repository]);

	return { data, refetch, isFetching };
}
