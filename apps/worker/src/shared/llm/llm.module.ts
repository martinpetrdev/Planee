import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LlmService } from './application/llm.service.js';
import { OpenaiApiPort } from './domain/ports/openai-api.port.js';
import { K8sLlamacppOpenaiApi } from './infrastructure/k8s-llamacpp.openai-api.js';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: OpenaiApiPort,
      useFactory: (config: ConfigService) =>
        new K8sLlamacppOpenaiApi(config.getOrThrow('llm.endpoint')),
      inject: [ConfigService],
    },
    LlmService,
  ],
  exports: [LlmService],
})
export class LlmModule {}
