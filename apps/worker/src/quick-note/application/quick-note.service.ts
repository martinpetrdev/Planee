import { Injectable, Logger } from '@nestjs/common';

import { LlmService } from '../../shared/llm/application/llm.service.js';
import { QuickNoteRepositoryPort } from '../domain/ports/quick-note-repository.port.js';

@Injectable()
export class QuickNoteService {
  private readonly logger = new Logger(QuickNoteService.name);

  constructor(
    private readonly llm: LlmService,
    private readonly repository: QuickNoteRepositoryPort,
  ) {}

  async generateAutofill(jobId: string, noteId: string) {
    const note = await this.repository.setAutofill(noteId, {
      status: 'processing',
      jobId: jobId,
      fields: {},
    });
    if (!note) throw new Error('Note does not exist');

    const autofill = await this.llm.completion(
      [
        {
          role: 'system',
          content:
            'Your goal is to convert given note into a structured task. Today is ' +
            new Date().toISOString() +
            '. Return dates in format yyyy-mm-dd, time in hh:mm. Return JSON with schema { task: { title: string, dueDate: "yyyy-mm-dd" | null, dueTime: "hh:mm" | null } }',
        },
        {
          role: 'user',
          content: note.text,
        },
      ],
      {
        temperature: 0,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'task',
            schema: {
              type: 'object',
              required: ['title', 'dueDate', 'dueTime'],
              properties: {
                title: { type: 'string' },
                dueDate: { type: ['string', 'null'] },
                dueTime: { type: ['string', 'null'] },
              },
            },
          },
        },
      },
    );

    const parsed = JSON.parse(autofill ?? '{}') ?? {};

    await this.repository.setAutofill(noteId, {
      status: 'done',
      jobId: jobId,
      fields: 'task' in parsed ? parsed.task : parsed,
    });
  }
}
