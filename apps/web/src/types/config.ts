export interface ConfigurationJson {
  baseUrl: string;
  api: {
    baseUrl: string;
  };
  marketingWeb: {
    baseUrl: string;
  };
  oidc: {
    issuer: string;
    clientId: string;
  };
}
