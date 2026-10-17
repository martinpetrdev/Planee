import { useCallback, useEffect, useState } from "react";
import type { Repository } from "./repository.ts";

export function useRepository<T>(repository: Repository<T>) {
	const [data, setData] = useState<T | null>(repository.data);
	const [isFetching, setIsFetching] = useState(repository.isFetching);

	const repoOnChange = useCallback((data: T | null) => {
		setData(data);
	}, []);
	const repoOnStatusChange = useCallback((data: boolean) => {
		setIsFetching(data);
	}, []);

	const refetch = useCallback(() => repository.requestRefetch(), [repository]);

	useEffect(() => {
		const onChangeCleanup = repository.$onChange(repoOnChange);
		const onStatusChangeCleanup =
			repository.$onStatusChange(repoOnStatusChange);

		return () => {
			onChangeCleanup();
			onStatusChangeCleanup();
		};
	}, [repository, repoOnChange, repoOnStatusChange]);

	return { data, refetch, isFetching };
}
