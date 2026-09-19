import {
  IsDateString,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TaskPriority } from '../../domain/task-priority.js';
import { ApiProperty } from '@nestjs/swagger';

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
}
