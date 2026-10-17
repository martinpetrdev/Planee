import axios, { type AxiosInstance } from 'axios';

import {
  type OpenaiApiMessage,
  type OpenaiApiOptions,
  OpenaiApiPort,
} from '../domain/ports/openai-api.port.js';

export class K8sLlamacppOpenaiApi extends OpenaiApiPort {
  private readonly connector: AxiosInstance;

  constructor(private readonly endpoint: string) {
    super();

    this.connector = axios.create({
      baseURL: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async completion(
    messages: OpenaiApiMessage[],
    opts?: OpenaiApiOptions,
  ): Promise<string> {
    const { data } = await this.connector.post('/v1/chat/completions', {
      ...opts,
      messages: messages,
    });

    return data?.choices?.[0]?.message?.content;
  }
}
