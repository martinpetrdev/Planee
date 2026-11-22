import { EventType } from "@repo-shared/contracts";

import { randomUUID } from "node:crypto";

export interface IBaseEventData<PayloadType> {
  type: EventType;
  payload: PayloadType;
}

export class BaseEvent<PayloadType extends {}> {
  protected readonly eventId: string;

  protected constructor(protected readonly data: IBaseEventData<PayloadType>) {
    this.eventId = randomUUID();
  }

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
}
