import { getUsersApiModule } from "./modules/users.ts";
import { getApiConnection } from "./primitives/connection.ts";
import type { TokenProvider } from "./types/Authorization.ts";

export function getApi(baseUrl: string, provideToken: TokenProvider) {
	const connection = getApiConnection(baseUrl, provideToken);

	return {
		users: getUsersApiModule(connection),
	};
}
