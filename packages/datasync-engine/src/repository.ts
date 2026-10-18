import { Observable } from "./observable.ts";

type OnChangeHandler<T> = (value: T[] | null) => void;
type OnStatusChangeHandler = (value: boolean) => void;
type DataMutationFunction<T> = (current: T[] | null) => T[] | null;

type RepositoryFetchHandler<T> = () => Promise<T[]>;
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
	fetch: RepositoryFetchHandler<T>;
	logger: RepositoryLogger;
	storage?: RepositoryStorage;
	getId: (item: T) => string;
};

export class Repository<T> {
	private readonly _options: RepositoryOptions<T>;

	private readonly _data = new Observable<T[] | null>(null);
	private readonly _isFetching = new Observable<boolean>(false);

	private _fetchingPromise: Promise<T[] | null> | null = null;
	private _generation: number = 0;

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

	public init() {
		this.log("Initializing...");
		this.requestRefetch();
	}

	public async requestRefetch() {
		await this.fetch();
	}

	public clear() {
		this._fetchingPromise = null;
		this._generation++;

		this._data.reset();
		this._isFetching.reset();

		this._options.storage?.clear(this._options.name);
	}

	private loadCached() {
		const cached = this._options.storage?.get(this._options.name);
		if (cached) this._data.set(JSON.parse(cached) as T[]);
	}

	private cache(data: T[] | null) {
		this._options.storage?.set(this._options.name, JSON.stringify(data));
	}

	private async fetch() {
		if (this._fetchingPromise)
			return await this._fetchingPromise.catch(() => null);

		const generation = this._generation;
		this.updateStatus(true);

		try {
			this._fetchingPromise = this._options.fetch();
			const data = await this._fetchingPromise;

			if (this._generation === generation) this.updateData(data);
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

	private log(...args: unknown[]) {
		this._options.logger.info(`REPOSITORY{${this._options.name}}`, ...args);
	}

	private updateData(data: T[] | null) {
		this.log("Set data");

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
}

export function createRepository<T>(options: RepositoryOptions<T>) {
	return new Repository<T>(options);
}
