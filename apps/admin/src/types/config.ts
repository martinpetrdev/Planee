export interface ConfigurationJson {
	baseUrl: string;
	api: {
		baseUrl: string;
	};
	oidc: {
		issuer: string;
		clientId: string;
	};
}
