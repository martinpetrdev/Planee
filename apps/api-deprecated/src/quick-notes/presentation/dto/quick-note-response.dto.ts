import { ApiProperty } from '@nestjs/swagger';

import { QuickNote } from '../../domain/quick-note.js';
import type { QuickNoteAutofillStatus } from '../../domain/quick-note.js';

export class QuickNoteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  autofill: Record<string, any> | null;

  @ApiProperty({ enum: ['processing', 'done', 'failed'], nullable: true })
  autofillStatus: QuickNoteAutofillStatus;

  @ApiProperty()
  createdAt: Date;

  constructor(data: QuickNoteResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(quickNote: QuickNote): QuickNoteResponseDto {
    return new QuickNoteResponseDto(quickNote.toObject());
  }
}
