/**
 * Parses flattened json as object.
 * ```json
 * {
 *   "a.b": "x",
 *   "a.c": "y",
 *   "b.a": "z"
 * }
 * ```
 * Turns into
 * ```json
 * {
 *   a: {
 *     b: "x",
 *     c: "y"
 *   },
 *   b: {
 *     a: "z"
 *   }
 * }
 * ```
 *
 * @param flattenedObject
 */
export function parseFlatObject(flattenedObject: string) {
	const out = {};

	for (const [key, value] of Object.entries(flattenedObject)) {
		setFlat(out, key, value);
	}

	return out;
}

function setFlat(obj: any, flatKey: string, value: unknown) {
	if (!flatKey.includes(".")) {
		obj[flatKey] = value;
		return;
	}

	const [key, ...rest] = flatKey.split(".") as [string, string[]];

	if (!obj[key]) obj[key] = {};

	setFlat(obj[key], rest.join("."), value);
}
