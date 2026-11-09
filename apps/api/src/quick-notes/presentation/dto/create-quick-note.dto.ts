import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import {z} from "zod";

export class CreateQuickNoteDto {
  @IsString()
  @Length(3, 256)
  @ApiProperty()
  text: string;
}

export const CreateQuickNoteMCPSchema = z.object({
  text: z.string().min(3).max(256).describe("Text of the quick note")
})