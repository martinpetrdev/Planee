import z from "zod";
import { McpKeyResponseSchema } from "./McpKeyResponse.schema.ts";

export const CreatedMcpKeyResponseSchema = McpKeyResponseSchema.extend({
	secret: z.string(),
});

export type CreatedMcpKeyResponse = z.infer<typeof CreatedMcpKeyResponseSchema>;
