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
	// Server total of paged repositories, kept in sync by upsert / remove
	private readonly _total = new Observable<number | null>(null);

	private _queue: Promise<void> = Promise.resolve();
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

	public get total(): number {
		return this._total.value ?? this.data?.length ?? 0;
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
	public requestRefetch() {
		return this.enqueue(() => this.fetch(null));
	}

	public fetchNextPage() {
		return this.enqueue(async () => {
			const cursor = this._nextCursor.value;
			if (cursor) await this.fetch(cursor);
		});
	}

	public clear() {
		this._queue = Promise.resolve();
		this._generation++;

		this._data.reset();
		this._isFetching.reset();
		this._nextCursor.reset();
		this._total.reset();
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

	// Fetches must run one at a time to prevent data corruption
	private enqueue(task: () => Promise<void>) {
		const generation = this._generation;
		const run = this._queue.then(() => {
			if (generation === this._generation) return task();
		});
		this._queue = run.catch(() => {});

		return run;
	}

	private async fetch(cursor: string | null) {
		const generation = this._generation;
		this.updateStatus(true);

		try {
			const result = await (cursor
				? this._options.fetch(cursor)
				: this.fetchLoadedPages());
			if (this._generation !== generation) return;

			if (Array.isArray(result)) this.updateData(result);
			else {
				// Parsed paged results - merge added by Claude Code (Claude Opus 5.5)
				this._nextCursor.set(result.nextCursor);
				this._total.set(result.total);

				if (cursor) this._pageCount++;
				this.updateData(
					cursor ? this.merge(this.data, result.items) : result.items,
				);
			}
		} catch (error) {
			// TODO: Notify user?
			this.log("Fetch failed, keeping cached data", error);
		} finally {
			if (generation === this._generation) this.updateStatus(false);
		}
	}

	public mutate(fn: DataMutationFunction<T>): void {
		this.log("Mutate data");

		const data = fn(this.data);
		this.updateData(data);
	}

	public upsert(item: T) {
		const id = this._options.getId(item);
		if (this._total.value !== null && !this.has(id))
			this._total.set(this._total.value + 1);

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
		if (this._total.value !== null && this.has(itemId))
			this._total.set(this._total.value - 1);

		// Move the cursor back (otherwise would skip items)
		if (itemId === this._nextCursor.value) {
			const list = this.data ?? [];
			const index = list.findIndex((i) => this._options.getId(i) === itemId);
			const previous = list[index - 1];

			this._nextCursor.set(previous ? this._options.getId(previous) : null);
		}

		this.mutate(
			(current) =>
				current?.filter((item) => this._options.getId(item) !== itemId) ?? null,
		);
	}

	private has(id: string) {
		return !!this.data?.some((item) => this._options.getId(item) === id);
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

	public $onTotalChange(handler: (value: number | null) => void) {
		return this._total.subscribe(handler);
	}

	public $onNextCursorChange(handler: (value: string | null) => void) {
		return this._nextCursor.subscribe(handler);
	}
}

export function createRepository<T>(options: RepositoryOptions<T>) {
	return new Repository<T>(options);
}
