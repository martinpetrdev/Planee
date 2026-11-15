import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Notification } from '../../domain/notification.js';
import { PushSenderPort } from '../../domain/ports/push-sender.port.js';

interface ExpoPushOkTicket {
  status: 'ok';
  id: string;
}

interface ExpoPushErrorTicket {
  status: 'error';
  message: string;
  details: {
    error: string;
    expoPushToken: string;
  };
}

type ExpoPushTicket = ExpoPushOkTicket | ExpoPushErrorTicket;

@Injectable()
export class ExpoPushSender extends PushSenderPort {
  async send(tokens: string[], notification: Notification): Promise<string[]> {
    const { data } = await axios
      .post<{ data: ExpoPushTicket[] }>(
        'https://exp.host/--/api/v2/push/send',
        {
          to: tokens,
          ...(!notification.silent
            ? { title: notification.title, body: notification.body }
            : {}),
          data: notification.data,
        },
      )
      .catch(() => ({
        data: { isError: true },
      }));
    if ('isError' in data) return []; // TODO: Handle this properly

    return data.data
      .filter(
        (ticket): ticket is ExpoPushErrorTicket =>
          ticket.status === 'error' &&
          ticket.details.error === 'DeviceNotRegistered',
      )
      .map((ticket) => ticket.details.expoPushToken);
  }
}
