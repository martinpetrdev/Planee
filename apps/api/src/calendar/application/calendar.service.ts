import { Injectable } from '@nestjs/common';

import { NewTimeBlock } from '../domain/new-time-block.ts';
import { TimeBlockRepositoryPort } from '../domain/ports/time-block-repository.port.ts';
import { TimeBlock } from '../domain/time-block.ts';
import { CreateTimeBlockCommand } from './commands/create-time-block.command.ts';
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

  public async createTimeBlock(
    command: CreateTimeBlockCommand,
  ): Promise<TimeBlock> {
    return await this.timeBlockRepository.insert(
      NewTimeBlock.create(
        command.start,
        command.end,
        command.title,
        command.taskId,
        command.userId,
      ),
    );
  }
}
