import { Injectable } from '@nestjs/common';

import { TimeBlockRepositoryPort } from '../domain/ports/time-block-repository.port.ts';
import { TimeBlock } from '../domain/time-block.ts';
import { GetTimeBlocksCommand } from './commands/get-time-blocks.command.ts';

@Injectable()
export class CalendarService {
  constructor(private readonly timeBlockRepository: TimeBlockRepositoryPort) {}

  public async getTimeBlocks(
    command: GetTimeBlocksCommand,
  ): Promise<TimeBlock[]> {
    return await this.timeBlockRepository.findAllByDateRange(
      command.userId,
      command.startDate,
      command.endDate,
    );
  }
}
