import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import httpConfig from './http.config.js';
import authConfig from './auth.config.js';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig, authConfig],
      ignoreEnvFile: true, // Already loaded by turborepo + dotenv OR kubernetes.
    }),
  ],
})
export class ConfigModule {}
