import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { Queue } from '@repo/shared';

import { REDIS_URL } from '../../config/redis.config.js';
import { WorkerService } from './application/worker.service.js';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: REDIS_URL,
      },
    }),
    BullModule.registerQueue({
      name: Queue.llm,
    }),
  ],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
