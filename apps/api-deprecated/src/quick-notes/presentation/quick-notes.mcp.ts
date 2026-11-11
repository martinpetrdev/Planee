import { Body, Injectable } from '@nestjs/common';
import { Resource, Tool } from '@nestjs/mcp';
import { z } from 'zod';

import { User } from '../../shared/auth/presentation/decorators/user.decorator.ts';
import { CreateQuickNoteCommand } from '../application/create-quick-note.command.ts';
import { DeleteQuickNoteCommand } from '../application/delete-quick-note.command.ts';
import { ListQuickNotesCommand } from '../application/list-quick-notes.command.ts';
import { QuickNotesService } from '../application/quick-notes.service.ts';
import { UpdateQuickNoteCommand } from '../application/update-quick-note.command.ts';
import { CreateQuickNoteMCPSchema } from './dto/create-quick-note.dto.ts';
import { DeleteQuickNoteMCPSchema } from './dto/delete-quick-note.dto.ts';
import { QuickNoteResponseDto } from './dto/quick-note-response.dto.ts';
import { UpdateQuickNoteMCPSchema } from './dto/update-quick-note.dto.ts';

@Injectable()
export class QuickNotesMcp {
  constructor(private readonly quickNotesService: QuickNotesService) {}

  @Resource({
    uri: 'quick-notes://list',
    description: 'List all quick notes, not paged',
    mimeType: 'application/json',
  })
  async list(@User('id') userId: string) {
    const notes = await this.quickNotesService.list(
      new ListQuickNotesCommand(userId),
    );

    return notes.map((note) => QuickNoteResponseDto.fromDomain(note));
  }

  @Tool({
    name: 'quick-notes.create',
    description: 'Create a new quick note',
    inputSchema: CreateQuickNoteMCPSchema,
  })
  async create(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof CreateQuickNoteMCPSchema>,
  ) {
    const note = await this.quickNotesService.create(
      new CreateQuickNoteCommand(userId, dto.text),
    );

    return QuickNoteResponseDto.fromDomain(note);
  }

  @Tool({
    name: 'quick-notes.update',
    description: 'Update a quick note',
    inputSchema: UpdateQuickNoteMCPSchema,
  })
  async update(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof UpdateQuickNoteMCPSchema>,
  ) {
    const note = await this.quickNotesService.update(
      new UpdateQuickNoteCommand(dto.id, userId, dto.text),
    );

    return QuickNoteResponseDto.fromDomain(note);
  }

  @Tool({
    name: 'quick-notes.delete',
    description: 'Delete a quick note',
    inputSchema: DeleteQuickNoteMCPSchema,
  })
  async delete(
    @User('id') userId: string,
    @Body() dto: z.infer<typeof DeleteQuickNoteMCPSchema>,
  ) {
    await this.quickNotesService.delete(
      new DeleteQuickNoteCommand(dto.id, userId),
    );
  }
}
