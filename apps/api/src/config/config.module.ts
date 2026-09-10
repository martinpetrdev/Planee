import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import httpConfig from './http.config.js';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig],
      ignoreEnvFile: true, // Already loaded by turborepo + dotenv OR kubernetes.
    }),
  ],
})
export class ConfigModule {}
