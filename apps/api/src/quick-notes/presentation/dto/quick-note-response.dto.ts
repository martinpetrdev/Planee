import { ApiProperty } from '@nestjs/swagger';

import { QuickNote } from '../../domain/quick-note.js';

export class QuickNoteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  constructor(data: QuickNoteResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(quickNote: QuickNote): QuickNoteResponseDto {
    return new QuickNoteResponseDto(quickNote.toObject());
  }
}
