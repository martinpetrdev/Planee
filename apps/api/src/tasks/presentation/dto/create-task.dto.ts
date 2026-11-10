import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { z } from 'zod';

import { TaskPriority } from '../../domain/task-priority.js';

export class CreateTaskDto {
  @IsString()
  @Length(3, 100)
  @ApiProperty()
  name: string;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  expectedDurationSeconds: number;

  @IsISO8601()
  @ApiProperty()
  dueDate: string;

  @IsEnum(TaskPriority)
  @ApiProperty()
  priority: TaskPriority;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  quickNoteId?: string;
}

export const CreateTaskMCPSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100)
    .describe('Name of the task / short description'),
  expectedDurationSeconds: z
    .int()
    .min(1)
    .describe('Expected duration of the task in seconds'),
  dueDate: z.iso
    .datetime()
    .describe(
      'Due date in ISO8601 format, without timezone offset. MUST be in the future',
    ),
  priority: z.enum(TaskPriority).describe('Priority of the task'),
  quickNoteId: z
    .ulid()
    .optional()
    .describe(
      'ID of the quick note this task was converted from, if any. Providing this will delete the given quick note.',
    ),
});
