import {
  IsDateString,
  IsEnum,
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

  @IsDateString()
  @ApiProperty()
  dueDate: string;

  @IsEnum(TaskPriority)
  @ApiProperty()
  priority: TaskPriority;
}
