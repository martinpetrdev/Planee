import { ApiProperty } from '@nestjs/swagger';

import { TimeBlock } from '../../domain/time-block.ts';

export class TimeBlockResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty({ nullable: true })
  title: string | null;

  @ApiProperty({ nullable: true })
  taskId: string | null;

  @ApiProperty()
  userId: string;

  constructor(data: TimeBlockResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(timeBlock: TimeBlock): TimeBlockResponseDto {
    return new TimeBlockResponseDto(timeBlock.toObject());
  }
}
