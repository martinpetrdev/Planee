import z from "zod";
import { dateTime } from "../codecs/dateTime.ts";
import { userId } from "../shared.ts";

export const McpKeyResponseSchema = z.object({
	id: z.ulid(),
	name: z.string(),
	userId: userId,
	createdAt: dateTime,
	updatedAt: dateTime,
});

export type McpKeyResponse = z.infer<typeof McpKeyResponseSchema>;
