import type { Repository } from "./repository.ts";

export function initRepositories(...repositories: Repository<any>[]) {
	for (const repository of repositories) {
		repository.init();
	}
}
