import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { Queue as QueueName } from '@repo/shared';

@Injectable()
export class WorkerService {
  constructor(@InjectQueue(QueueName.llm) private readonly queue: Queue) {}

  public async enqueue<T>(taskName: string, data: T) {
    const job = await this.queue.add(taskName, data);

    return job.id;
  }

  public async dequeue(jobId: string) {
    await this.queue.remove(jobId);
  }
}
