import { ApiVersion } from "@repo/shared";
import { api } from "@/api/api";

const BASE_URL = "/admin";

export const hasAccess = async () => {
	const data = await api
		.get<"">(ApiVersion.v1, `${BASE_URL}/access`)
		.catch(() => ({
			isError: true,
		}));

	if (data && "isError" in data) return false;
	return true;
};
