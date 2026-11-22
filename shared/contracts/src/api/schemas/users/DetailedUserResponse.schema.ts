import { UserRole } from "@repo-shared/server-auth";
import z from "zod";
import { dateTime } from "../codecs/dateTime.ts";
import { userId } from "../shared.ts";

export const DetailedUserResponseSchema = z.object({
	id: userId,
	name: z.string(),
	email: z.email(),
	roles: z.array(z.enum(UserRole)),
	createdAt: dateTime,
	updatedAt: dateTime,
});

export type DetailedUserResponse = z.infer<typeof DetailedUserResponseSchema>;
