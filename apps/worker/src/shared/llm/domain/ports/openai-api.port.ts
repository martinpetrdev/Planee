export interface OpenaiApiMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

export type OpenaiApiOptions = Partial<{
	temperature: number;
	response_format: {
		type: "json_schema";
		json_schema: Record<string, any>;
	};
}>;

export abstract class OpenaiApiPort {
	abstract completion(
		messages: OpenaiApiMessage[],
		opts?: OpenaiApiOptions,
	): Promise<string>;
}
