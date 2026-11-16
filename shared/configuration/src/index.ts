import {z} from "zod";
import {parseFlatJson} from "./json.ts";

const configurationSchema = z.object({
  cors: z.object({
    allowedOrigins: z.string(),
  }),
  http: z.object({
    api: z.object({
      port: z.coerce.number().int().min(1024).max(65535),
    }),
  })
})

export type ConfigurationObject = z.infer<typeof configurationSchema>

export class Configuration {
  private readonly configuration: ConfigurationObject;

  constructor(json: string) {
    this.configuration = configurationSchema.parse(parseFlatJson(json));
  }

  public getObject() {
    return this.configuration;
  }
}
