import { Global, Module } from '@nestjs/common';
import { FlagEvaluatorPort } from './domain/ports/flag-evaluator.port.js';
import { ConfigService } from '@nestjs/config';
import { FliptFlagEvaluator } from './infrastructure/flipt.flag-evaluator.js';

@Global()
@Module({
  providers: [
    {
      provide: FlagEvaluatorPort,
      useFactory: (config: ConfigService) =>
        new FliptFlagEvaluator(
          config.getOrThrow('flags.url'),
          config.getOrThrow('flags.namespace'),
        ),
      inject: [ConfigService],
    },
  ],
  exports: [FlagEvaluatorPort],
})
export class FlagsModule {}
