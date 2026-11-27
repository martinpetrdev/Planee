import z from "zod";
import { dateTime } from "../codecs/dateTime.ts";
import { userId } from "../shared.ts";

export const QuickNoteResponseSchema = z.object({
	id: z.ulid(),
	text: z.string(),
	userId: userId,
	createdAt: dateTime,
	updatedAt: dateTime,
});

export type QuickNoteResponse = z.infer<typeof QuickNoteResponseSchema>;
