import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiVersion } from '@repo/shared';
import { Flags } from '../../flags/presentation/decorators/flags.decorator.js';
import { FeatureFlag } from '../../flags/domain/flag.js';
import { EventBusPort } from '../domain/ports/event-bus.port.js';
import { User } from '../../auth/presentation/decorators/user.decorator.js';
import { interval, map, merge, Observable } from 'rxjs';

@Controller({
  path: '/events',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@Flags(FeatureFlag.AccessEnabled)
export class EventsController {
  constructor(private readonly bus: EventBusPort) {}

  @Sse('/')
  stream(@User('id') userId: string): Observable<MessageEvent> {
    const events = new Observable<MessageEvent>((sub) =>
      this.bus.listen((event) => {
        if (event.userId !== userId) return;

        sub.next({
          type: event.type,
          data: event.data as Record<string, unknown>,
        });
      }),
    );

    // Ignored by clients, but required to keep the connection alive,
    // as some load balancers and proxies close idle connection
    const heartbeat = interval(25_000).pipe(
      map(() => ({ type: 'ping', data: '' })),
    );

    return merge(events, heartbeat);
  }
}
