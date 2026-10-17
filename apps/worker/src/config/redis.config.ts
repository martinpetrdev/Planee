import { registerAs } from "@nestjs/config";

export const REDIS_URL = process.env.REDIS_URL ?? "";

export default registerAs("redis", () => ({
	url: REDIS_URL,
}));
