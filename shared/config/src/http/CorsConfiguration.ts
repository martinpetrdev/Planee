import * as process from "node:process";

export class CorsConfiguration {
  private _allowedOrigins: string[] = [];

  public async $init(): Promise<void> {
    // Load and validate allowed origins
    const allowedOrigins =
      process.env.PLANEE_CONF_HTTP_ALLOWED_ORIGINS?.split(",");
    if (!allowedOrigins) throw new Error("No CORS origins provided");

    allowedOrigins.forEach((origin) => {
      if (!URL.canParse(origin))
        throw new Error(`CORS origin URL "${origin}" could not be parsed.`);
    });

    this._allowedOrigins = allowedOrigins;
  }

  public get options() {
    return {
      origin: this._allowedOrigins,
    };
  }
}
