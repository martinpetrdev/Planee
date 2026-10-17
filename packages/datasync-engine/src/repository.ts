type OnChangeHandler<T> = (value: T | null) => void;
type OnStatusChangeHandler = (value: boolean) => void;
type DataMutationFunction<T> = (current: T | null) => T | null;

type RepositoryFetchHandler<T> = () => Promise<T>;
type RepositoryLogger = {
	info(...args: unknown[]): void;
};
type RepositoryOptions<T> = {
	name: string;
	fetch: RepositoryFetchHandler<T>;
	logger: RepositoryLogger;
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

	private async fetch() {
		if (this._fetchingPromise) return await this._fetchingPromise;

		this.log("Fetching...");

		this.updateStatus(true);
		this._fetchingPromise = this._options.fetch();
		const data = await this._fetchingPromise;

		this.updateData(data);
		this.updateStatus(false);
		this._fetchingPromise = null;
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
