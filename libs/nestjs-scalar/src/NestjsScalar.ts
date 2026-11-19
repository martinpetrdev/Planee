import type { INestApplication } from "@nestjs/common";
import {
	DocumentBuilder,
	type OpenAPIObject,
	SwaggerModule,
} from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

interface INestjsScalarBearerAuthOptions {
	type: "openIdConnect";
	description?: string;
}

interface INestjsScalarOptions {
	title: string;
	version: string;
	description?: string;
	tagGroups?: Record<string, Record<string, string>>;
	auth?: INestjsScalarBearerAuthOptions;
	path: string;
}

export class NestjsScalar {
	private readonly swagger: Omit<OpenAPIObject, "paths">;
	private readonly swaggerModule: SwaggerModule;

	constructor(
		private readonly app: INestApplication,
		private readonly options: INestjsScalarOptions,
	) {
		const builder = new DocumentBuilder()
			.setTitle(options.title)
			.setVersion(options.version);

		if (options.description) builder.setDescription(options.description);

		const xtagGroups = [];
		if (options.tagGroups)
			for (const [name, tags] of Object.entries(options.tagGroups)) {
				xtagGroups.push({
					name: name,
					tags: Object.keys(tags),
				});

				for (const [tag, description] of Object.entries(tags)) {
					builder.addTag(tag, description);
				}
			}

		if (options.auth) {
			if ("type" in options.auth && options.auth.type === "openIdConnect")
				builder.addBearerAuth({
					type: options.auth.type,
					description: options.auth.description ?? "",
				});
		}

		this.swagger = builder.build();
		this.swaggerModule = SwaggerModule.createDocument(app, this.swagger);

		Object.assign(this.swaggerModule, {
			"x-tagGroups": xtagGroups,
		});

		app.use(
			options.path,
			apiReference({
				content: this.swaggerModule,
				showDeveloperTools: "never",
				agent: {
					disabled: true,
				},
				mcp: {
					disabled: true,
				},
			}),
		);
	}
}
