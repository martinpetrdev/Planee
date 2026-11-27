import z from "zod";

export const CreateMcpKeySchema = z.object({
	name: z.string().min(3).max(64),
});

export type CreateMcpKey = z.infer<typeof CreateMcpKeySchema>;
