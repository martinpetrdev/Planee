import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { z } from 'zod';

import { PAGE_SIZE } from '@repo/shared';

const midnight = new Date();
midnight.setHours(0, 0, 0, 0);

export class ListTasksDto {
  @IsIn(['overdue', 'planned', 'completed'])
  @ApiProperty()
  scope: 'overdue' | 'planned' | 'completed';

  @IsISO8601()
  @ApiProperty({ example: midnight.toISOString() })
  dayStart: string; // Clients midnight in ISO format

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  cursorId: string; // Last page task id

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGE_SIZE)
  @ApiProperty({ example: PAGE_SIZE, required: false })
  limit?: number;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiProperty({ enum: ['asc', 'desc'], required: false })
  order?: 'asc' | 'desc';
}

export const ListTasksMCPSchema = z.object({
  scope: z
    .enum(['overdue', 'planned', 'completed'])
    .describe(
      'Scope of the task list. Sorted by due date/completion status. Overdue are not completed, completed but overdue go to completed.',
    ),
  dayStart: z.iso
    .datetime()
    .describe(
      'Datetime of the current day start (00:00 of the local time), must include Z',
    ),
  cursorId: z
    .ulid()
    .optional()
    .describe(
      'ID of the last task on the current to use as a cursor for the next page',
    ),
  limit: z
    .int()
    .min(1)
    .max(PAGE_SIZE)
    .optional()
    .describe('Maximum number of tasks returned'),
  order: z.enum(['asc', 'desc']).optional().describe('Ordering by due date'),
});
