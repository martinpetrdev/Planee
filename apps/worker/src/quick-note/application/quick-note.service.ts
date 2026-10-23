import { Injectable, Logger } from '@nestjs/common';

import { EventBusPort } from '../../shared/events/domain/ports/event-bus.port.ts';
import { LlmService } from '../../shared/llm/application/llm.service.ts';
import { QuickNoteRepositoryPort } from '../domain/ports/quick-note-repository.port.js';
import { quickNoteUpdated } from './quick-note-updated.command.ts';

@Injectable()
export class QuickNoteService {
  private readonly logger = new Logger(QuickNoteService.name);

  constructor(
    private readonly llm: LlmService,
    private readonly repository: QuickNoteRepositoryPort,
    private readonly events: EventBusPort,
  ) {}

  async generateAutofill(jobId: string, noteId: string) {
    const note = await this.repository.setAutofill(noteId, {
      status: 'processing',
      jobId: jobId,
      fields: {},
    });
    if (!note) throw new Error('Note does not exist');

    this.logger.log(`Generating autofill for quick note ${noteId}...`);

    let fields: object;
    try {
      const autofill = await this.llm.completion(
        [
          {
            role: 'system',
            content:
              'Your goal is to convert given note into a structured task. Today is ' +
              new Date().toISOString() +
              '. Return dates in format yyyy-mm-dd, time in hh:mm, expected duration is how long the task will probably take (upper bound) in minutes. Return JSON with schema { task: { title: string, dueDate: "yyyy-mm-dd" | null, dueTime: "hh:mm" | null, expectedDurationMinutes: number | null } }. Feel free to guess the date/time/duration - it\'s for autofill only.',
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
                required: [
                  'title',
                  'dueDate',
                  'dueTime',
                  'expectedDurationMinutes',
                ],
                properties: {
                  title: { type: 'string' },
                  dueDate: { type: ['string', 'null'] },
                  dueTime: { type: ['string', 'null'] },
                  expectedDurationMinutes: { type: ['integer', 'null'] },
                },
              },
            },
          },
        },
      );

      const parsed = JSON.parse(autofill ?? '{}') ?? {};
      fields = 'task' in parsed ? parsed.task : parsed;
    } catch (e) {
      const failed = await this.repository.setAutofill(noteId, {
        status: 'failed',
        jobId: jobId,
        fields: {},
      });
      if (failed) await this.events.publish(quickNoteUpdated(failed));

      throw e;
    }

    const updatedQuickNote = await this.repository.setAutofill(noteId, {
      status: 'done',
      jobId: jobId,
      fields,
    });
    if (!updatedQuickNote) throw new Error('Quick note not found');

    await this.events.publish(quickNoteUpdated(updatedQuickNote));

    this.logger.log(`Generated autofill for quick note ${noteId}`);
  }
}
