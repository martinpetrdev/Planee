export interface ConfigurationJson {
	baseUrl: string;
	api: {
		baseUrl: string;
	};
	app: {
		baseUrl: string;
	};
	oidc: {
		issuer: string;
		clientId: string;
	};
}
