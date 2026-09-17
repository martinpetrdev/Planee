import { Injectable } from '@nestjs/common';
import { PushSenderPort } from '../../domain/ports/push-sender.port.js';
import { Notification } from '../../domain/notification.js';
import axios from 'axios';

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
  constructor() {
    super();
  }

  async send(tokens: string[], notification: Notification): Promise<string[]> {
    const { data } = await axios
      .post<{ data: ExpoPushTicket[] }>(
        'https://exp.host/--/api/v2/push/send',
        {
          to: tokens,
          title: notification.title,
          body: notification.body,
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
          ticket.status == 'error' &&
          ticket.details.error === 'DeviceNotRegistered',
      )
      .map((ticket) => ticket.details.expoPushToken);
  }
}
