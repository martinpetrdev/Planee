"use server";

import { ApiVersion } from "@repo/shared";
import { api } from "@/api/api";

const BASE_URL = "/users";

interface JoinEarlyAccessProgramDto {
	inviteId: string;
	email: string;
}

export const joinEarlyAccessProgram = async (dto: JoinEarlyAccessProgramDto) =>
	api.post<object, JoinEarlyAccessProgramDto>(
		ApiVersion.v1,
		`${BASE_URL}/join/early-access`,
		dto,
	);
