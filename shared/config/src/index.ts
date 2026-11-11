import {CorsConfiguration} from "./http/CorsConfiguration.ts";

export class Configuration {
  private readonly _corsConfiguration = new CorsConfiguration();

  public async $init(): Promise<void> {
    await Promise.all([this._corsConfiguration].map((c) => c.$init()));
  }

  public get cors() {
    return this._corsConfiguration;
  }
}

let config: Configuration;

export async function getConfiguration(): Promise<Configuration> {
  if (!config) config = new Configuration();
  await config.$init();

  return config;
}
