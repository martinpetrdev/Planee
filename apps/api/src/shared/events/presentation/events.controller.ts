import { Controller, Sse } from '@nestjs/common';
import { ApiVersion } from '@repo-shared/contracts';
import { User } from '@repo-shared/server-auth';

import { EventDispatcher } from '../application/event.dispatcher.ts';

@Controller({
  path: '/events',
  version: ApiVersion.v1,
})
export class EventsController {
  constructor(private readonly dispatcher: EventDispatcher) {}

  @Sse('/stream')
  stream(@User('id') userId: string) {
    return this.dispatcher.observeForUser(userId);
  }
}
