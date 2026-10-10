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
