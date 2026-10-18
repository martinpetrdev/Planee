import { Observable } from "./observable.ts";

type OnChangeHandler<T> = (value: T[] | null) => void;
type OnStatusChangeHandler = (value: boolean) => void;
type DataMutationFunction<T> = (current: T[] | null) => T[] | null;

type RepositoryFetchHandler<T> = () => Promise<T[]>;
type RepositoryPage<T> = {
	items: T[];
	total: number;
	nextCursor: string | null;
};
type RepositoryPageFetchHandler<T> = (
	cursor: string | null, // cursor is null for first page
) => Promise<RepositoryPage<T>>;
type RepositoryLogger = {
	info(...args: unknown[]): void;
};
export type RepositoryStorage = {
	get(name: string): string | null;
	set(name: string, value: string): void;
	clear(name: string): void;
};
type RepositoryOptions<T> = {
	name: string;
	fetch: RepositoryFetchHandler<T> | RepositoryPageFetchHandler<T>;
	logger: RepositoryLogger;
	storage?: RepositoryStorage;
	getId: (item: T) => string;
	sort?: (a: T, b: T) => number;
};

export class Repository<T> {
	private readonly _options: RepositoryOptions<T>;

	private readonly _data = new Observable<T[] | null>(null);
	private readonly _isFetching = new Observable<boolean>(false);
	private readonly _nextCursor = new Observable<string | null>(null);

	private _fetchingPromise: Promise<T[] | RepositoryPage<T>> | null = null;
	private _generation: number = 0;
	private _pageCount: number = 1;

	constructor(options: RepositoryOptions<T>) {
		this._options = options;

		this.loadCached();
	}

	public get data(): T[] | null {
		return this._data.value;
	}

	public get isFetching(): boolean {
		return this._isFetching.value;
	}

	public get hasNextPage(): boolean {
		return this._nextCursor.value !== null;
	}

	public init() {
		this.log("Initializing...");
		this.requestRefetch();
	}

	/*
	 * WARNING: Refetches every page loaded so far
	 */
	public async requestRefetch() {
		await this.fetch(null);
	}

	public async fetchNextPage() {
		const cursor = this._nextCursor.value;
		if (cursor) await this.fetch(cursor);
	}

	public clear() {
		this._fetchingPromise = null;
		this._generation++;

		this._data.reset();
		this._isFetching.reset();
		this._nextCursor.reset();
		this._pageCount = 1;

		this._options.storage?.clear(this._options.name);
	}

	private loadCached() {
		const cached = this._options.storage?.get(this._options.name);
		if (cached) this._data.set(JSON.parse(cached) as T[]);
	}

	private cache(data: T[] | null) {
		this._options.storage?.set(this._options.name, JSON.stringify(data));
	}

	private async fetch(cursor: string | null) {
		if (this._fetchingPromise) {
			await this._fetchingPromise.catch(() => null);

			return;
		}

		const generation = this._generation;
		this.updateStatus(true);

		try {
			this._fetchingPromise = cursor
				? this._options.fetch(cursor)
				: this.fetchLoadedPages();
			const result = await this._fetchingPromise;
			if (this._generation !== generation) return;

			if (Array.isArray(result)) this.updateData(result);
			else {
				// Parsed paged results - merge added by Claude Code (Claude Opus 5.5)
				this._nextCursor.set(result.nextCursor);

				if (cursor) this._pageCount++;
				this.updateData(
					cursor ? this.merge(this.data, result.items) : result.items,
				);
			}
		} catch (error) {
			// TODO: Notify user?
			this.log("Fetch failed, keeping cached data", error);
		} finally {
			if (generation === this._generation) {
				this.updateStatus(false);
				this._fetchingPromise = null;
			}
		}
	}

	public mutate(fn: DataMutationFunction<T>): void {
		this.log("Mutate data");

		const data = fn(this.data);
		this.updateData(data);
	}

	public upsert(item: T) {
		const id = this._options.getId(item);

		this.mutate((current) => {
			const list = current ?? [];
			const exists = list.some((i) => this._options.getId(i) === id);

			return exists
				? list.map((existing) =>
						this._options.getId(existing) === id ? item : existing,
					)
				: [...list, item];
		});
	}

	public remove(itemId: string) {
		this.mutate(
			(current) =>
				current?.filter((item) => this._options.getId(item) !== itemId) ?? null,
		);
	}

	// Added by Claude Code (Claude Opus 5.5)
	private async fetchLoadedPages(): Promise<T[] | RepositoryPage<T>> {
		const first = await this._options.fetch(null);
		if (Array.isArray(first)) return first;

		let page = first;
		let items = first.items;
		for (let i = 1; i < this._pageCount && page.nextCursor; i++) {
			page = (await this._options.fetch(page.nextCursor)) as RepositoryPage<T>;
			items = this.merge(items, page.items);
		}

		return { ...page, items };
	}

	private merge(current: T[] | null, items: T[]): T[] {
		const byId = new Map(
			(current ?? []).map((item) => [this._options.getId(item), item]),
		);
		for (const item of items) byId.set(this._options.getId(item), item);

		return [...byId.values()];
	}

	private log(...args: unknown[]) {
		this._options.logger.info(`REPOSITORY{${this._options.name}}`, ...args);
	}

	private updateData(data: T[] | null) {
		this.log("Set data");

		if (data && this._options.sort) data = [...data].sort(this._options.sort);

		this.cache(data);
		this._data.set(data);
	}

	private updateStatus(data: boolean) {
		this.log("Set status:", data);

		this._isFetching.set(data);
	}

	public $onChange(handler: OnChangeHandler<T>) {
		return this._data.subscribe(handler);
	}

	public $onStatusChange(handler: OnStatusChangeHandler) {
		return this._isFetching.subscribe(handler);
	}

	public $onNextCursorChange(handler: (value: string | null) => void) {
		return this._nextCursor.subscribe(handler);
	}
}

export function createRepository<T>(options: RepositoryOptions<T>) {
	return new Repository<T>(options);
}
