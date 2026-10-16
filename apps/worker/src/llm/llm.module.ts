import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { Queue } from "@repo/shared";
import { LlmProcessor } from "./presentation/llm.processor.js";

@Module({
	imports: [
		BullModule.registerQueue({
			name: Queue.llm,
		}),
	],
	controllers: [],
	providers: [LlmProcessor],
	exports: [],
})
export class LlmModule {}
