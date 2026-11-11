import { NestApplication, NestFactory } from "@nestjs/core";

import { Configuration, getConfiguration } from "@repo/config";

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
  }

  static async bootstrap(): Promise<void> {
    await Program.init();
    await Program.configure();
  }
}

void Program.bootstrap();
