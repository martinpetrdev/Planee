import { BaseEvent, IBaseEventData } from './base.event.ts';
import { randomUUID } from 'node:crypto';

export interface IUserEventData<PayloadType>
  extends IBaseEventData<PayloadType> {
  userId: string;
}

export class UserEvent<PayloadType extends {}> extends BaseEvent<PayloadType> {
  protected constructor(
    id: string,
    protected readonly data: IUserEventData<PayloadType>,
  ) {
    super(id, data);
  }

  public get userId(): string {
    return this.data.userId;
  }

  public toObject() {
    return {
      id: this.eventId,
      type: this.data.type,
      payload: this.data.payload,
      userId: this.data.userId,
    };
  }

  public static create<PayloadType extends {}>(
    data: IUserEventData<PayloadType>,
  ) {
    return new UserEvent(randomUUID(), data);
  }

  // @ai/assisted(Claude Opus 5.5): Rebuilds the event from the full serialized object (id, type, payload, userId).
  public static fromObject<PayloadType extends {}>({
    id,
    ...data
  }: IUserEventData<PayloadType> & { id: string }) {
    return new UserEvent(id, data);
  }
}
