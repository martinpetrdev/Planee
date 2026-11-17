import { z } from "zod";
import { parseFlatObject } from "./json.ts";

const configurationSchema = z.object({
	cors: z.object({
		allowedOrigins: z.string(),
	}),
	http: z.object({
		api: z.object({
			// @ai/assisted(Claude Fable 5.2): Fixed port parsing by coercing the string from the env config to a number.
			port: z.coerce.number().int().min(1024).max(65535),
		}),
	}),
	database: z.object({
		url: z.url(),
	}),
});

export type ConfigurationObject = z.infer<typeof configurationSchema>;

export class Configuration {
	private readonly configuration: ConfigurationObject;

	constructor(object: any) {
		this.configuration = configurationSchema.parse(parseFlatObject(object));
	}

	public getObject() {
		return this.configuration;
	}
}
