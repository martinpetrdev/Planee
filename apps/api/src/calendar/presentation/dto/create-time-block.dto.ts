import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, Length } from 'class-validator';

export class CreateTimeBlockDto {
  @IsISO8601()
  @ApiProperty({ type: 'string', default: new Date().toISOString() })
  start: string;

  @IsISO8601()
  @ApiProperty({ type: 'string', default: new Date().toISOString() })
  end: string;

  @IsString()
  @Length(3, 128)
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ nullable: true })
  taskId: string;
}
