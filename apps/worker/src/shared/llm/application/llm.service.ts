import { Injectable } from '@nestjs/common';

import {
  OpenaiApiMessage,
  OpenaiApiOptions,
  OpenaiApiPort,
} from '../domain/ports/openai-api.port.js';

@Injectable()
export class LlmService {
  constructor(private readonly openaiApi: OpenaiApiPort) {}

  async completion(
    messages: OpenaiApiMessage[],
    opts?: OpenaiApiOptions,
  ): Promise<string> {
    return await this.openaiApi.completion(messages, opts);
  }
}
