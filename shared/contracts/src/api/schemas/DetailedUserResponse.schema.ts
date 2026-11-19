import { UserRole } from "@repo-shared/server-auth";
import z from "zod";

export const DetailedUserResponseSchema = z.object({
	id: z.uuidv4(),
	name: z.string(),
	email: z.email(),
	roles: z.array(z.enum(UserRole)),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type DetailedUserResponse = z.infer<typeof DetailedUserResponseSchema>;
