import {AddressingConfiguration} from "./http/AddressingConfiguration.ts";
import {CorsConfiguration} from "./http/CorsConfiguration.ts";

export class Configuration {
  private readonly _corsConfiguration = new CorsConfiguration();
  private readonly _addressingConfiguration = new AddressingConfiguration();

  public async $init(): Promise<void> {
    await Promise.all(
      [this._corsConfiguration, this._addressingConfiguration].map((c) =>
        c.$init(),
      ),
    );
  }

  public get cors() {
    return this._corsConfiguration;
  }

  public get addressing() {
    return this._addressingConfiguration;
  }
}

let config: Configuration;

export async function getConfiguration(): Promise<Configuration> {
  if (!config) config = new Configuration();
  await config.$init();

  return config;
}
