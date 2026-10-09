"use server";

import { ApiVersion } from "@repo/shared";
import { api } from "@/api/api";

const BASE_URL = "/admin/programs";

export const createEapInvite = async () =>
	api.post<
		{
			id: string;
		},
		object
	>(ApiVersion.v1, `${BASE_URL}/eap/invite`, {});
