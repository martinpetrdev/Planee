import { BaseEvent } from '../domain/models/base.event.ts';

export abstract class EventPublisherPort {
  abstract publish<PayloadType extends {}>(
    event: BaseEvent<PayloadType>,
  ): Promise<void>;
}
