import z from "zod";

// @ai/created(Claude Opus 5.5): Codec that serializes Date to an ISO string so the schema converts to OpenAPI.
export const dateTime = z.codec(z.date(), z.iso.datetime(), {
	decode: (date) => date.toISOString(),
	encode: (iso) => new Date(iso),
});
