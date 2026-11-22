import { EventType } from "@repo-shared/contracts";

import { UserEvent } from "../../../shared/events/domain/models/user.event.ts";

interface IQuickNoteUpdatedEventPayload {
  id: string;
}

export class QuickNoteUpdatedEvent extends UserEvent<IQuickNoteUpdatedEventPayload> {
  constructor(data: { id: string; userId: string }) {
    super({
      type: EventType.QuickNoteUpdated,
      payload: { id: data.id },
      userId: data.userId,
    });
  }
}
