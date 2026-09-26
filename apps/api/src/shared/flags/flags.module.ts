import { Global, Module } from '@nestjs/common';
import { FlagEvaluatorPort } from './domain/ports/flag-evaluator.port.js';
import { ConfigService } from '@nestjs/config';
import { FliptFlagEvaluator } from './infrastructure/flipt.flag-evaluator.js';
import { APP_GUARD } from '@nestjs/core';
import { FlagsGuard } from './infrastructure/flags.guard.js';
import { FlagsService } from './application/flags.service.js';
import { FlagsController } from './presentation/flags.controller.js';

@Global()
@Module({
  providers: [
    FlagsService,
    {
      provide: FlagEvaluatorPort,
      useFactory: (config: ConfigService) =>
        new FliptFlagEvaluator(
          config.getOrThrow('flags.url'),
          config.getOrThrow('flags.namespace'),
        ),
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: FlagsGuard,
    },
  ],
  controllers: [FlagsController],
  exports: [FlagEvaluatorPort],
})
export class FlagsModule {}
