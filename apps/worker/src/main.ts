import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ApiVersion } from "@repo/shared";
import { AppModule } from "./app.module.js";
import { getServicePort } from "./config/http.config.js";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {});

	app.enableShutdownHooks();
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: ApiVersion.v1,
	});

	await app.listen(getServicePort());
}

void bootstrap();
