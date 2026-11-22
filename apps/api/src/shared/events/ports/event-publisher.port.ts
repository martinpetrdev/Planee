import { BaseEvent, IBaseEventData } from "../domain/models/base.event.ts";

export abstract class EventPublisherPort {
  abstract publish<
    PayloadType extends {},
    DataType extends IBaseEventData<PayloadType>,
  >(event: BaseEvent<PayloadType, DataType>): Promise<void>;
}
