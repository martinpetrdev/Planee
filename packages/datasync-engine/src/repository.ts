type OnChangeHandler<T> = (value: T | null) => void;
type OnStatusChangeHandler = (value: boolean) => void;
type DataMutationFunction<T> = (current: T | null) => T | null;

type RepositoryFetchHandler<T> = () => Promise<T>;
type RepositoryLogger = {
	info(...args: unknown[]): void;
};
export type RepositoryStorage = {
	get(name: string): string | null;
	set(name: string, value: string): void;
};
type RepositoryOptions<T> = {
	name: string;
	fetch: RepositoryFetchHandler<T>;
	logger: RepositoryLogger;
	storage?: RepositoryStorage;
};

export class Repository<T> {
	private readonly _options: RepositoryOptions<T>;

	private _data: T | null = null;
	private _isFetching: boolean = false;

	private _fetchingPromise: Promise<T | null> | null = null;

	private readonly _onChangeHandlers: Set<OnChangeHandler<T>> = new Set();
	private readonly _onStatusChangeHandlers: Set<OnStatusChangeHandler> =
		new Set();

	constructor(options: RepositoryOptions<T>) {
		this._options = options;

		this.loadCached();
	}

	public get data(): T | null {
		return this._data;
	}

	public get isFetching(): boolean {
		return this._isFetching;
	}

	public init() {
		this.log("Initializing...");
		this.requestRefetch();
	}

	public async requestRefetch() {
		await this.fetch();
	}

	private loadCached() {
		const cached = this._options.storage?.get(this._options.name);
		if (cached) this._data = JSON.parse(cached) as T;
	}

	private cache(data: T | null) {
		this._options.storage?.set(this._options.name, JSON.stringify(data));
	}

	private async fetch() {
		if (this._fetchingPromise) return await this._fetchingPromise;

		this.updateStatus(true);

		try {
			this._fetchingPromise = this._options.fetch();
			this.updateData(await this._fetchingPromise);
		} catch (error) {
			this.log("Fetch failed, keeping cached data", error);
		} finally {
			this.updateStatus(false);
			this._fetchingPromise = null;
		}
	}

	public mutate(fn: DataMutationFunction<T>): void {
		this.log("Mutate data");

		const data = fn(this.data);
		this.updateData(data);
	}

	private log(...args: unknown[]) {
		this._options.logger.info(`REPOSITORY{${this._options.name}}`, ...args);
	}

	private updateData(data: T | null) {
		this.log("Set data");

		this._data = data;
		this.cache(data);
		this.fireOnChange(data);
	}

	private updateStatus(data: boolean) {
		this.log("Set status:", data);

		this._isFetching = data;
		this.fireOnStatusChange(data);
	}

	public $onChange(handler: OnChangeHandler<T>) {
		this._onChangeHandlers.add(handler);

		return () => this._onChangeHandlers.delete(handler);
	}

	public $onStatusChange(handler: OnStatusChangeHandler) {
		this._onStatusChangeHandlers.add(handler);

		return () => this._onStatusChangeHandlers.delete(handler);
	}

	private fireOnChange(data: T | null) {
		this._onChangeHandlers.forEach((handler) => {
			handler(data);
		});
	}

	private fireOnStatusChange(data: boolean) {
		this._onStatusChangeHandlers.forEach((handler) => {
			handler(data);
		});
	}
}

export function createRepository<T>(options: RepositoryOptions<T>) {
	return new Repository<T>(options);
}
