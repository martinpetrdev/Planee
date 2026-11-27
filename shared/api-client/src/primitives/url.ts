import type { ApiVersion } from "@repo-shared/contracts";

export function buildURL(version: ApiVersion, path: string[] | string) {
	const fullPath = Array.isArray(path) ? path : [path];
	const processedPath = fullPath
		.map((p) => (p.startsWith("/") ? p.substring(1) : p))
		.map((p) => (p.endsWith("/") ? p.substring(0, p.length - 1) : p));

	return `/${version}/${processedPath.join("/")}`;
}
