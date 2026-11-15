import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { Queue as QueueName } from '@repo/shared';

@Injectable()
export class WorkerService {
  constructor(
    @InjectQueue(QueueName.quickNote) private readonly quickNoteQueue: Queue,
  ) {}

  public async enqueueQuickNote<T>(taskName: string, data: T) {
    const job = await this.quickNoteQueue.add(taskName, data, {
      attempts: 1,
    });

    return job.id;
  }

  public async dequeueQuickNote(jobId: string) {
    await this.quickNoteQueue.remove(jobId);
  }
}
