import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';

const midnight = new Date();
midnight.setHours(0, 0, 0, 0);

export class ListTasksDto {
  @IsIn(['overdue', 'today', 'upcoming', 'completed'])
  @ApiProperty()
  scope: 'overdue' | 'today' | 'upcoming' | 'completed';

  @IsISO8601()
  @ApiProperty({ example: midnight.toISOString() })
  dayStart: string; // Clients midnight in ISO format

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  cursorId: string; // Last page task id
}
