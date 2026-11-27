import { EventType } from '@repo-shared/contracts';

import { randomUUID } from 'node:crypto';

export interface IBaseEventData<PayloadType> {
  type: EventType;
  payload: PayloadType;
}

export class BaseEvent<PayloadType extends {}> {
  protected constructor(
    protected readonly eventId: string,
    protected readonly data: IBaseEventData<PayloadType>,
  ) {}

  public get id() {
    return this.eventId;
  }

  public get type() {
    return this.data.type;
  }

  public get payload() {
    return this.data.payload;
  }

  public toObject() {
    return {
      id: this.eventId,
      type: this.data.type,
      payload: this.data.payload,
    };
  }

  public static create<PayloadType extends {}>(
    data: IBaseEventData<PayloadType>,
  ) {
    return new BaseEvent<PayloadType>(randomUUID(), data);
  }

  // @ai/assisted(Claude Opus 5.5): Rebuilds the event from the full serialized object (id, type, payload).
  public static fromObject<PayloadType extends {}>({
    id,
    ...data
  }: IBaseEventData<PayloadType> & { id: string }) {
    return new BaseEvent<PayloadType>(id, data);
  }
}
