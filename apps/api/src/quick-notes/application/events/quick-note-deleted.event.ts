import { EventType } from "@repo-shared/contracts";

import { UserEvent } from "../../../shared/events/domain/models/user.event.ts";

interface IQuickNoteDeletedEventPayload {
  id: string;
}

export class QuickNoteDeletedEvent extends UserEvent<IQuickNoteDeletedEventPayload> {
  constructor(data: { id: string; userId: string }) {
    super({
      type: EventType.QuickNoteUpdated,
      payload: { id: data.id },
      userId: data.userId,
    });
  }
}
