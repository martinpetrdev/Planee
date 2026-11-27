import { Body, Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import {
  type CreateQuickNote,
  CreateQuickNoteSchema,
  QuickNoteResponseSchema,
  type UpdateQuickNote,
  UpdateQuickNoteSchema,
} from '@repo-shared/contracts';
import { User } from '@repo-shared/server-auth';
import { z } from 'zod';

import { CreateQuickNoteCommand } from '../application/commands/create-quick-note.command.ts';
import { DeleteQuickNoteCommand } from '../application/commands/delete-quick-note.command.ts';
import { ListQuickNoteCommand } from '../application/commands/list-quick-note.command.ts';
import { UpdateQuickNoteCommand } from '../application/commands/update-quick-note.command.ts';
import { QuickNoteCommandHandler } from '../application/handlers/quick-note.command-handler.ts';

const JsonCompatibleQuickNoteResponseSchema = QuickNoteResponseSchema.extend({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

@Injectable()
export class QuickNoteMcp {
  constructor(private readonly handler: QuickNoteCommandHandler) {}

  @Tool({
    name: 'quickNote.list',
    description: 'List all quick notes, not paginated',
    // @ai/assisted(Claude Opus 5.5): Swapped the date codecs for ISO strings, since the SDK validates the JSON-serialized result.
    outputSchema: z.array(JsonCompatibleQuickNoteResponseSchema),
  })
  async list(@User('id') userId: string) {
    const entities = await this.handler.handleList(
      new ListQuickNoteCommand({
        userId,
      }),
    );

    return entities.map((entity) => entity.toObject());
  }

  @Tool({
    name: 'quickNote.create',
    description: 'Create quick note',
    inputSchema: CreateQuickNoteSchema,
    outputSchema: JsonCompatibleQuickNoteResponseSchema,
  })
  async create(@User('id') userId: string, @Body() dto: CreateQuickNote) {
    const entity = await this.handler.handleCreate(
      new CreateQuickNoteCommand({
        userId: userId,
        text: dto.text,
      }),
    );

    return entity.toObject();
  }

  @Tool({
    name: 'quickNote.update',
    description: 'Update quick note',
    inputSchema: UpdateQuickNoteSchema.extend({
      id: z.ulid(),
    }),
    outputSchema: JsonCompatibleQuickNoteResponseSchema,
  })
  async update(
    @User('id') userId: string,
    @Body() dto: UpdateQuickNote & { id: string },
  ) {
    const entity = await this.handler.handleUpdate(
      new UpdateQuickNoteCommand({
        userId,
        ...dto,
      }),
    );

    return entity.toObject();
  }

  @Tool({
    name: 'quickNote.delete',
    description: 'Delete quick note',
    inputSchema: z.object({
      id: z.ulid(),
    }),
  })
  async delete(@User('id') userId: string, @Body() dto: { id: string }) {
    await this.handler.handleDelete(
      new DeleteQuickNoteCommand({
        userId,
        id: dto.id,
      }),
    );
  }
}
