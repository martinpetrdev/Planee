import { BaseEvent, IBaseEventData } from '../domain/models/base.event.ts';

// @ai/created(Claude Opus 5.5): Typed the fromObject factory that subscribers use to rebuild events from their full serialized object.
export interface EventFactory<
  PayloadType extends {},
  EventClass extends BaseEvent<PayloadType>,
> {
  fromObject(object: IBaseEventData<PayloadType> & { id: string }): EventClass;
}

export abstract class EventSubscriberPort {
  abstract subscribeAll<
    PayloadType extends {},
    EventClass extends BaseEvent<PayloadType>,
  >(
    eventClass: EventFactory<PayloadType, EventClass>,
    listener: (event: EventClass) => void | Promise<void>,
  ): Promise<void>;
  abstract subscribeUser<
    PayloadType extends {},
    EventClass extends BaseEvent<PayloadType>,
  >(
    userId: string,
    eventClass: EventFactory<PayloadType, EventClass>,
    listener: (event: EventClass) => void | Promise<void>,
  ): Promise<void>;
}
