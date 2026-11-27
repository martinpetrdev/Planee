import z from "zod";

export const CreateQuickNoteSchema = z.object({
	text: z.string().min(1).max(256),
});

export type CreateQuickNote = z.infer<typeof CreateQuickNoteSchema>;
