import { Injectable } from '@nestjs/common';
import {Resource} from "@nestjs/mcp";
import {User} from "../../shared/auth/presentation/decorators/user.decorator.ts";
import {ListQuickNotesCommand} from "../application/list-quick-notes.command.ts";
import {QuickNoteResponseDto} from "./dto/quick-note-response.dto.ts";
import {QuickNotesService} from "../application/quick-notes.service.ts";

@Injectable()
export class QuickNotesMcp {
  constructor(private readonly quickNotesService: QuickNotesService) {}

  @Resource({
    uri: "quick-notes://list",
    description: "List all quick notes, not paged",
    mimeType: "application/json"
  })
  async list(@User('id') userId: string) {
    const notes = await this.quickNotesService.list(
      new ListQuickNotesCommand(userId),
    );

    return notes.map((note) => QuickNoteResponseDto.fromDomain(note));
  }
}
