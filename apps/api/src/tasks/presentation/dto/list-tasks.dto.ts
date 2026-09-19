import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';

export class ListTasksDto {
  @IsIn(['overdue', 'today', 'upcoming'])
  @ApiProperty()
  scope: 'overdue' | 'today' | 'upcoming';

  @IsISO8601()
  @ApiProperty()
  dayStart: string; // Clients midnight in ISO format

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  cursorId: string; // Last page task id
}
