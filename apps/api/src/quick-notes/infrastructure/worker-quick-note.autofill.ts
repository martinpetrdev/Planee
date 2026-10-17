import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { WorkerService } from '../../shared/worker/application/worker.service.js';
import {
  QuickNoteAutofillPort,
  QuickNoteAutofillRequest,
} from '../domain/ports/quick-note-autofill.port.js';
import { QuickNoteRepositoryPort } from '../domain/ports/quick-note-repository.port.js';

@Injectable()
export class WorkerQuickNoteAutofill extends QuickNoteAutofillPort {
  constructor(
    private readonly worker: WorkerService,
    private readonly quickNoteRepository: QuickNoteRepositoryPort,
  ) {
    super();
  }

  async request(req: QuickNoteAutofillRequest): Promise<void> {
    const res = await this.quickNoteRepository.setAutofill(req.noteId, {
      status: 'processing',
      jobId: null,
      fields: {},
    });
    if (!res)
      throw new InternalServerErrorException(
        'Failed to update entity autofill status',
      );

    await this.worker.enqueueQuickNote('autofill', req);
  }
}
