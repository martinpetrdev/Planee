import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Queue } from "@repo/shared";
import type { Job } from "bullmq";

@Processor(Queue.llm)
export class LlmProcessor extends WorkerHost {
	async process(job: Job, token: string | undefined): Promise<any> {
		console.log(job, token);

		return Promise.resolve(undefined);
	}
}
