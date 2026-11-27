import { ApiVersion, type DetailedUserResponse } from "@repo-shared/contracts";
import type { AxiosInstance } from "axios";
import { buildURL } from "../primitives/url.ts";

const MODULE_PATH = "/users";

export function getUsersApiModule(connection: AxiosInstance) {
	return {
		me: {
			async $get() {
				const { data } = await connection.get<DetailedUserResponse>(
					buildURL(ApiVersion.v1, [MODULE_PATH, "/me"]),
				);

				return data;
			},
		},
	};
}
