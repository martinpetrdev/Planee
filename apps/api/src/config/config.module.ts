import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import httpConfig from './http.config.js';
import authConfig from './auth.config.js';
import flagsConfig from './flags.config.js';
import redisConfig from './redis.config.js';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig, authConfig, flagsConfig, redisConfig],
      ignoreEnvFile: true, // Already loaded by turborepo + dotenv OR kubernetes.
    }),
  ],
})
export class ConfigModule {}
