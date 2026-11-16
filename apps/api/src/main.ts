import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.ts";
import { Configuration, ConfigurationObject } from "@repo-shared/configuration";
import { StandardSchemaValidationPipe, VersioningType } from "@nestjs/common";
import { ApiVersion } from "@repo-shared/contracts";

class Program {
  static readonly APP_MODULE = AppModule;

  static app: NestApplication;
  static config: ConfigurationObject;

  static async init(): Promise<void> {
    Program.config = new Configuration(
      process.env.APPLICATION_CONFIG!,
    ).getObject();

    Program.app = await NestFactory.create(Program.APP_MODULE, {
      // Prevent hanging processes
      forceCloseConnections: true,
    });
  }

  static async configure(): Promise<void> {
    Program.app.enableShutdownHooks();

    Program.app.enableCors({
      origin: Program.config.cors.allowedOrigins.split(" "),
    });
    Program.app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: ApiVersion.v1,
    });

    Program.app.useGlobalPipes(new StandardSchemaValidationPipe());
  }

  static async bootstrap(): Promise<void> {
    await Program.init();
    await Program.configure();

    await Program.app.listen(Program.config.http.api.port);
  }
}

void Program.bootstrap();
