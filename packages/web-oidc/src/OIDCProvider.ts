interface IOIDCProviderOptions {
	issuer: string;
	clientId: string;
	clientSecret: string;
	scope: string[];
	gracePeriod: number;
	baseURL: string;
	cookiePrefix: string;
	cookieEncryptionKey: string;
}

export class OIDCProvider {
	private readonly _options: IOIDCProviderOptions;

	constructor(opts: IOIDCProviderOptions) {
		this._options = opts;
	}

	public get issuerURL() {
		return new URL(this._options.issuer);
	}

	public get clientId() {
		return this._options.clientId;
	}

	public get clientSecret() {
		return this._options.clientSecret;
	}

	public get scope() {
		return this._options.scope.join(" ");
	}

	public get gracePeriod() {
		return this._options.gracePeriod;
	}

	public get baseURL() {
		return new URL(this._options.baseURL);
	}

	public get cookiePrefix() {
		return this._options.cookiePrefix;
	}

	public get cookieEncryptionKey() {
		return this._options.cookieEncryptionKey;
	}

	public get cookieSecure() {
		const url = this.baseURL;

		return url.protocol.includes("https");
	}
}
