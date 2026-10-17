import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { Queue as QueueName } from '@repo/shared';

import { QuickNoteService } from '../application/quick-note.service.js';

@Processor(QueueName.quickNote)
export class QuickNoteProcessor extends WorkerHost {
  private readonly logger = new Logger(QuickNoteProcessor.name);

  constructor(private readonly svc: QuickNoteService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'autofill':
        if (!job.data.noteId) throw new Error('No noteId provided.');

        return await this.svc.generateAutofill(job.id!, job.data.noteId);
      default:
        throw new Error(`Invalid job name ${job.name}`);
    }
  }

  @OnWorkerEvent('error')
  async onError(): Promise<void> {
    console.log('ERROR');
  }

  @OnWorkerEvent('failed')
  async failed(...args: any[]) {
    console.log('FAIL', args);
  }
}
