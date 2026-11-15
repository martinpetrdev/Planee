import * as process from "node:process";

export class AddressingConfiguration {
  private _apiSvcPort: number = 4001;

  public async $init(): Promise<void> {
  }

  public get api() {
    return {
      svcPort: this._apiSvcPort,
    };
  }
}
