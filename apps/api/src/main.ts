import { VersioningType } from "@nestjs/common";
import { NestApplication, NestFactory } from "@nestjs/core";

import { Configuration, getConfiguration } from "@repo/config";
import { ApiVersion } from "@repo/contracts";

import { AppModule } from "./app.module.ts";

class Program {
  static readonly APP_MODULE = AppModule;

  static app: NestApplication;
  static config: Configuration;

  static async init(): Promise<void> {
    Program.config = await getConfiguration();

    Program.app = await NestFactory.create(Program.APP_MODULE, {
      // Prevent hanging processes
      forceCloseConnections: true,
    });
  }

  static async configure(): Promise<void> {
    Program.app.enableShutdownHooks();

    Program.app.enableCors(Program.config.cors.options);
    Program.app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: ApiVersion.v1,
    });
  }

  static async bootstrap(): Promise<void> {
    await Program.init();
    await Program.configure();

    await Program.app.listen(Program.config.addressing.api.svcPort);
  }
}

void Program.bootstrap();
