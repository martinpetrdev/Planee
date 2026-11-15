import { Controller, MessageEvent, Sse } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { interval, map, merge, Observable } from 'rxjs';

import { ApiVersion } from '@repo/shared';

import { ApiAuthResponses } from '../../../utils/swagger/decorators.js';
import { User } from '../../auth/presentation/decorators/user.decorator.js';
import { FeatureFlag } from '../../flags/domain/flag.js';
import { Flags } from '../../flags/presentation/decorators/flags.decorator.js';
import { EventBusPort } from '../domain/ports/event-bus.port.js';

@Controller({
  path: '/events',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@ApiTags('events')
@Flags(FeatureFlag.AccessEnabled)
export class EventsController {
  constructor(private readonly bus: EventBusPort) {}

  @Sse('/')
  @ApiOperation({
    description:
      'Endpoint for SSE streaming of the event bus messages. Sends `ping` event every 25s to keep the connection alive.',
  })
  @ApiAuthResponses()
  @ApiOkResponse({
    description: 'SSE stream of events',
  })
  stream(@User('id') userId: string): Observable<MessageEvent> {
    const events = new Observable<MessageEvent>((sub) =>
      this.bus.listen((event) => {
        if (event.userId !== userId) return;

        sub.next({
          id: event.id,
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
