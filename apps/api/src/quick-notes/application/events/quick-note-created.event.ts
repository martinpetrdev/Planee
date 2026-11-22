import { EventType } from "@repo-shared/contracts";

import { UserEvent } from "../../../shared/events/domain/models/user.event.ts";

interface IQuickNoteCreatedEventPayload {
  id: string;
}

export class QuickNoteCreatedEvent extends UserEvent<IQuickNoteCreatedEventPayload> {
  constructor(data: { id: string; userId: string }) {
    super({
      type: EventType.QuickNoteCreated,
      payload: { id: data.id },
      userId: data.userId,
    });
  }
}
