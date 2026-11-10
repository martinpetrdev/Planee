import { TimeBlock } from '../time-block.ts';

export abstract class TimeBlockRepositoryPort {
  abstract findAllByDateRange(
    userId: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TimeBlock[]>;
}
