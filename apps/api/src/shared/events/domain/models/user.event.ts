import { BaseEvent, IBaseEventData } from "./base.event.ts";

export interface IUserEventData<
  PayloadType,
> extends IBaseEventData<PayloadType> {
  userId: string;
}

export class UserEvent<PayloadType extends {}> extends BaseEvent<PayloadType> {
  constructor(protected readonly data: IUserEventData<PayloadType>) {
    super(data);
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
}
