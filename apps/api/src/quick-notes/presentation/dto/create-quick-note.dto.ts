import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateQuickNoteDto {
  @IsString()
  @Length(3, 256)
  @ApiProperty()
  text: string;
}
