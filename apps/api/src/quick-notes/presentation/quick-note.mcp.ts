import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { QuickNoteResponseSchema } from '@repo-shared/contracts';
import { User } from '@repo-shared/server-auth';
import { z } from 'zod';

import { ListQuickNoteCommand } from '../application/commands/list-quick-note.command.ts';
import { QuickNoteCommandHandler } from '../application/handlers/quick-note.command-handler.ts';

@Injectable()
export class QuickNoteMcp {
  constructor(private readonly handler: QuickNoteCommandHandler) {}

  @Tool({
    name: 'quickNote.list',
    description: 'List all quick notes, not paginated',
    // @ai/assisted(Claude Opus 5.5): Swapped the date codecs for ISO strings, since the SDK validates the JSON-serialized result.
    outputSchema: z.array(
      QuickNoteResponseSchema.extend({
        createdAt: z.iso.datetime(),
        updatedAt: z.iso.datetime(),
      }),
    ),
  })
  async list(@User('id') userId: string) {
    const entities = await this.handler.handleList(
      new ListQuickNoteCommand({
        userId,
      }),
    );

    return entities.map((entity) => entity.toObject());
  }
}
