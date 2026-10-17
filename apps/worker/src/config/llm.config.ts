import { registerAs } from "@nestjs/config";

export default registerAs("llm", () => ({
	endpoint: process.env.CONF_WORKER_LLM_URL,
}));
