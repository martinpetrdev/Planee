export class Observable<T> {
	private _value: T;
	private readonly _default: T;
	private readonly _handlers = new Set<(value: T) => void>();

	constructor(def: T) {
		this._value = def;
		this._default = def;
	}

	public get value() {
		return this._value;
	}

	public set(value: T) {
		this._value = value;
		this._handlers.forEach((handler) => {
			handler(value);
		});
	}

	public reset() {
		this.set(this._default);
	}

	public subscribe(handler: (value: T) => void) {
		this._handlers.add(handler);

		return () => {
			this._handlers.delete(handler);
		};
	}
}
